import { normalizeAiCallerSeed, validateConversationalSeed } from './pvx-conversational-return-core.mjs';

export const WEB_PVX_MAPPING_BUILD = '408-CF-PVX-WEB-1.0';
export const WEB_PVX_RELEVANCE_BUILD = '408-CF-PVX-RELEVANCE-1.2';
export const WEB_PVX_MAPPING_SCHEMA = '1.0';
export const WEB_PVX_MAPPING_CONTRACT = '408farmers-coveragefit-native-web-mapping-v1';

export const WEB_PVX_DISCOVERY_ORDER = Object.freeze([
  'shoppingReason',
  'improvementPriorities',
  'ownershipDuration',
  'stayIntent',
  'upgradeSummary',
  'otherProperties',
  'claimExperience',
  'permissionToAdvise'
]);

export const WEB_PVX_ENTRY_TYPES = Object.freeze([
  'homepage', 'home', 'buyer', 'home_auto', 'professional', 'flyer', 'qr',
  'neighbor', 'ai_caller', 'direct', 'legacy_recovery'
]);

const PROFESSIONAL_PROGRAMS = new Set(['healthcare', 'teachers', 'technology', 'engineers']);
const CUSTOMER_SELECTIONS = new Set([
  'start_snapshot', 'review_owned_home', 'buying_home', 'review_home_auto',
  'renter', 'contact_dylan', 'review_professional_home', 'secure_continue',
  'renewal_approaching', 'premium_increase', 'nonrenewal_concern',
  'coverage_concern', 'service_concern', 'bundle_review', 'long_relationship',
  'general_exploration'
]);
const RELEVANCE_REASONS = Object.freeze({
  renewal_approaching:{shoppingReason:'renewal_increase',words:'My renewal is approaching.'},
  premium_increase:{shoppingReason:'renewal_increase',words:'My price recently changed.'},
  buying_home:{shoppingReason:'buying_home',ownershipDuration:'buying_now',words:'I’m buying a home.'},
  nonrenewal_concern:{shoppingReason:'nonrenewal_concern',words:'I have a nonrenewal concern.'},
  coverage_concern:{shoppingReason:'something_else',words:'I have a coverage question.'},
  service_concern:{shoppingReason:'service_change',words:'I want a different service experience.'},
  bundle_review:{shoppingReason:'something_else',words:'I want to review home and auto together.'},
  long_relationship:{shoppingReason:'comparison',words:'I want to keep what works and check the fit.'},
  general_exploration:{shoppingReason:'comparison',words:'I’m simply exploring.'}
});
const text = (value, max = 240) => String(value ?? '')
  .trim()
  .replace(/[<>\u0000-\u001f\u007f]/g, '')
  .slice(0, max);
const boolOrNull = value => value === true || value === 'true' || value === '1'
  ? true
  : value === false || value === 'false' || value === '0'
    ? false
    : null;

function firstValue(...values) {
  for (const value of values) {
    const cleaned = text(value);
    if (cleaned) return cleaned;
  }
  return '';
}

function address(source = {}) {
  const formattedAddress = firstValue(source.propertyAddress, source.property_address, source.address);
  const line1 = firstValue(source.propertyStreet, source.property_street, formattedAddress.split(',')[0]);
  const city = firstValue(source.propertyCity, source.property_city);
  const state = firstValue(source.propertyState, source.property_state, 'CA').toUpperCase().slice(0, 2);
  const postalCode = firstValue(source.propertyZip, source.property_zip).slice(0, 10);
  const known = Boolean(formattedAddress || line1);
  return {
    formattedAddress: text(formattedAddress, 240),
    line1: text(line1, 120),
    city: text(city, 80),
    state,
    postalCode,
    source: known ? 'customer-reported' : 'unknown',
    confirmed: false,
    confirmationRequired: known
  };
}

function explicitDiscovery(selection, exactWords) {
  const answers = {};
  const words = {};
  const relevance=RELEVANCE_REASONS[selection];
  if(relevance){answers.shoppingReason=relevance.shoppingReason;if(relevance.ownershipDuration)answers.ownershipDuration=relevance.ownershipDuration;words.shoppingReason=text(exactWords,240)||relevance.words;}
  if (selection === 'review_home_auto') {
    answers.shoppingReason = 'something_else';
    words.shoppingReason = text(exactWords, 240) || 'I want to review my home and auto together';
  }
  return { answers, exactCustomerWords: words };
}

function nextQuestion(answers = {}) {
  return WEB_PVX_DISCOVERY_ORDER.find(id => answers[id] == null) || 'complete';
}

function normalizedEntryType(value) {
  const candidate = text(value, 40).toLowerCase();
  return WEB_PVX_ENTRY_TYPES.includes(candidate) ? candidate : 'direct';
}

export function mapWebToPvx(source = {}, options = {}) {
  const entryType = normalizedEntryType(source.entryType || source.entry_type);
  const customerSelection = text(source.customerSelection || source.customer_selection, 60).toLowerCase();
  const selection = CUSTOMER_SELECTIONS.has(customerSelection) ? customerSelection : 'start_snapshot';
  const professionalProgram = text(source.professionalProgram || source.professional_program, 40).toLowerCase();
  const explicit = explicitDiscovery(selection, source.customerWords || source.customer_words);
  const conversational = entryType === 'ai_caller' ? normalizeAiCallerSeed(source) : null;
  if (conversational) {
    Object.assign(explicit.answers, conversational.answers);
    Object.assign(explicit.exactCustomerWords, conversational.exactCustomerWords);
  }
  const propertyAddress = address(source);
  const routePath = text(source.routePath || source.route_path, 160) || '/';
  const campaignId = firstValue(source.campaignId, source.campaign_id);
  const campaignVariant = firstValue(source.campaignVariant, source.campaign_variant);
  const campaignZip = firstValue(source.campaignZip, source.campaign_zip);
  const sourceName = firstValue(source.source, '408farmers_web');
  const isHumanRoute = ['renter', 'contact_dylan'].includes(selection) || Boolean(conversational?.producerSafeFallback);
  const currentQuestionId = nextQuestion(explicit.answers);
  const originalWords = text(conversational?.originalWords || source.customerWords || source.customer_words, 800);
  const conflictFields = Array.isArray(options.conflictFields)
    ? options.conflictFields.map(value => text(value, 80)).filter(Boolean)
    : [];

  return {
    schemaVersion: WEB_PVX_MAPPING_SCHEMA,
    contractId: WEB_PVX_MAPPING_CONTRACT,
    build: WEB_PVX_MAPPING_BUILD,
    canEnterPvx: !isHumanRoute,
    producerSafeFallback: isHumanRoute,
    fallbackDestination: selection === 'renter' ? '/contact/?intent=renters' : '/contact/',
    entry: {
      type: entryType,
      routePath,
      hostMode: text(source.hostMode || source.host_mode, 40) || '408farmers',
      source: sourceName,
      address: propertyAddress,
      customerSelection: selection,
      explicitlySelected: CUSTOMER_SELECTIONS.has(customerSelection)
    },
    journey: {
      journeyId: text(source.journeyId, 120),
      currentStage: 'entry',
      completedStages: [],
      resumeState: {
        status: 'active',
        exactStage: 'entry',
        exactStep: propertyAddress.confirmationRequired ? 'address_confirmation' : 'address_entry'
      },
      source: sourceName
    },
    discovery: {
      schemaVersion: '1.0',
      contractId: 'coveragefit-five-minute-home-discovery-v1',
      currentQuestionId,
      answers: explicit.answers,
      exactCustomerWords: explicit.exactCustomerWords,
      prefilledQuestionIds: Object.keys(explicit.answers),
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: currentQuestionId === 'complete' ? new Date().toISOString() : null
    },
    context: {
      buyer: {
        active: entryType === 'buyer' || selection === 'buying_home',
        closingDate: text(source.closingDate || source.closing_date, 40),
        occupancy: text(source.occupancy, 40),
        rush: boolOrNull(source.rush),
        evidenceStatus: 'customer-reported'
      },
      bundle: {
        active: entryType === 'home_auto' || selection === 'review_home_auto' || selection === 'bundle_review',
        currentBundleStatus: text(source.bundleStatus || source.bundle_status, 60),
        evidenceStatus: 'customer-reported'
      },
      professional: {
        active: PROFESSIONAL_PROGRAMS.has(professionalProgram),
        program: PROFESSIONAL_PROGRAMS.has(professionalProgram) ? professionalProgram : '',
        occupation: text(source.occupation, 120),
        eligibilityDetermined: false,
        discountDetermined: false
      },
      conversation: conversational ? {
        channel: 'ai_caller',
        intent: conversational.intent,
        conversationId: conversational.conversationId,
        producerSafeFallback: conversational.producerSafeFallback,
        originalWordsPreserved: Boolean(conversational.originalWords)
      } : null
    },
    attribution: {
      source: sourceName,
      entryType,
      routePath,
      campaign: text(source.campaign, 160),
      campaignId: text(campaignId, 180),
      campaignVariant: text(campaignVariant, 80),
      campaignZip: text(campaignZip, 10),
      creative: text(source.creative, 120),
      partnerId: text(source.partnerId || source.partner_id, 64),
      partnerName: text(source.partnerName || source.partner_name, 100),
      realtorId: text(source.realtorId || source.realtor_id, 64),
      referralToken: text(source.referralToken || source.referral_token, 80),
      referralId: text(source.referralId || source.referral_id, 120),
      utm: {
        source: text(source.utmSource || source.utm_source, 120),
        medium: text(source.utmMedium || source.utm_medium, 120),
        campaign: text(source.utmCampaign || source.utm_campaign, 160),
        content: text(source.utmContent || source.utm_content, 160),
        term: text(source.utmTerm || source.utm_term, 160)
      }
    },
    evidence: {
      status: originalWords ? 'customer-reported' : 'unknown',
      exactCustomerWords: originalWords,
      sourceRefs: originalWords ? [`web:${entryType}:customer_selection`] : []
    },
    reconciliation: {
      agreementFields: [],
      conflictFields,
      unknownFields: WEB_PVX_DISCOVERY_ORDER.filter(id => explicit.answers[id] == null),
      identityMergeAuthorized: false
    },
    consent: {
      reportSaved: false,
      contact: false,
      sms: false,
      call: false,
      email: false,
      knownContactIsPermission: false
    },
    ownership: {
      producerId: text(source.producerId || source.producer_id, 80) || 'dylan',
      silentlyReassigned: false
    },
    semantics: {
      campaignContextIsDiscoveryAnswer: false,
      pageRouteIsDiscoveryAnswer: false,
      customerReportedIsVerified: false,
      advisoryReviewTopicIsRecommendation: false,
      topicResponseIsRecommendationResponse: false,
      snapshotSavedIsContactPermission: false,
      smsPermissionIsCallOrEmailPermission: false,
      quoteReadinessIsCarrierEligibility: false,
      discoveryAffectsProtectionScore: false,
      actionReadinessInferred: false,
      changeScopeInferred: false,
      occupationProvesEligibility: false,
      identityMatchedByContactAlone: false,
      bindAuthorized: false
    }
  };
}

export function validateWebPvxMapping(mapping = {}) {
  const errors = [];
  if (mapping.contractId !== WEB_PVX_MAPPING_CONTRACT) errors.push('contract');
  if (!WEB_PVX_ENTRY_TYPES.includes(mapping.entry?.type)) errors.push('entry.type');
  if (mapping.semantics?.discoveryAffectsProtectionScore !== false) errors.push('score_boundary');
  if (mapping.semantics?.actionReadinessInferred !== false || mapping.semantics?.changeScopeInferred !== false) errors.push('readiness_boundary');
  if (mapping.semantics?.campaignContextIsDiscoveryAnswer !== false) errors.push('campaign_boundary');
  if (mapping.semantics?.snapshotSavedIsContactPermission !== false) errors.push('save_consent_boundary');
  if (mapping.consent?.contact !== false || mapping.consent?.sms !== false || mapping.consent?.call !== false || mapping.consent?.email !== false) errors.push('consent');
  if (mapping.context?.professional?.eligibilityDetermined !== false) errors.push('eligibility');
  if (mapping.reconciliation?.identityMergeAuthorized !== false) errors.push('identity');
  const prefillAllowed = mapping.entry?.type === 'ai_caller' ? WEB_PVX_DISCOVERY_ORDER : ['shoppingReason', 'ownershipDuration'];
  if (mapping.discovery?.prefilledQuestionIds?.some(id => !prefillAllowed.includes(id))) errors.push('unsupported_prefill');
  if (mapping.entry?.type === 'ai_caller') {
    const conversationValidation = validateConversationalSeed({
      intent:mapping.context?.conversation?.intent,
      canEnterPvx:mapping.canEnterPvx,
      producerSafeFallback:mapping.producerSafeFallback,
      answers:mapping.discovery?.answers,
      consent:mapping.consent
    });
    if (!conversationValidation.valid) errors.push(...conversationValidation.errors.map(value=>`conversation:${value}`));
  }
  return { valid: errors.length === 0, errors };
}
