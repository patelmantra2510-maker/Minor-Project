import type { QuestionDefinition } from '../../types/questionnaire';
import { fieldById } from './fields';

export const eligibilityQuestions: QuestionDefinition[] = [
  // 1. Education Level
  {
    id: 'q_education_level',
    fieldId: 'field_education_level',
    question: 'What level of education are you currently pursuing or recently enrolled in?',
    description: 'Select your ongoing course level. This is the single biggest factor for matching schemes.',
    inputType: 'radio',
    options: fieldById['field_education_level']?.options,
    allowUnknown: false,
    priority: 100,
    informationValue: 10,
  },
  // 2. Stream
  {
    id: 'q_stream',
    fieldId: 'field_stream',
    question: 'What is your course stream or broad discipline?',
    description: 'Special technical and professional scholarships depend on your branch of study.',
    inputType: 'select',
    options: fieldById['field_stream']?.options,
    allowOther: true,
    priority: 95,
    informationValue: 9,
  },
  // 3. Academic Year
  {
    id: 'q_academic_year',
    fieldId: 'field_academic_year',
    question: 'Which academic year are you currently in?',
    description: 'Some scholarships accept first-year admissions only, while others are renewals or open.',
    inputType: 'radio',
    options: fieldById['field_academic_year']?.options,
    priority: 90,
    informationValue: 8,
  },
  // 4. Domicile State
  {
    id: 'q_domicile_state',
    fieldId: 'field_domicile_state',
    question: 'What is your official domicile or home state?',
    description: 'State government schemes like MYSY or Digital Gujarat require domicile or studying in the state.',
    inputType: 'radio',
    options: fieldById['field_domicile_state']?.options,
    allowOther: true,
    priority: 92,
    informationValue: 10,
  },
  // 5. Gender
  {
    id: 'q_gender',
    fieldId: 'field_gender',
    question: 'What is your gender?',
    description: 'Several schemes (e.g., AICTE Pragati) are specifically reserved for girl students.',
    inputType: 'radio',
    options: fieldById['field_gender']?.options,
    allowPreferNotToSay: true,
    priority: 88,
    informationValue: 8,
  },
  // 6. Social Category
  {
    id: 'q_category',
    fieldId: 'field_category',
    question: 'What is your social / reservation category?',
    description: 'Used for constitutional scholarships (SC, ST, SEBC/OBC, EWS, or General).',
    inputType: 'radio',
    options: fieldById['field_category']?.options,
    allowOther: true,
    allowPreferNotToSay: true,
    priority: 85,
    informationValue: 10,
  },
  // 7. Family Income
  {
    id: 'q_family_income',
    fieldId: 'field_family_income',
    question: 'What is your total annual family income (in INR)?',
    description: 'Combined gross annual income of parents or legal guardians from all sources.',
    inputType: 'currency',
    placeholder: 'e.g. 250000',
    allowUnknown: true,
    priority: 86,
    informationValue: 10,
  },
  // 8. Latest Academic Score / Percentage
  {
    id: 'q_latest_score',
    fieldId: 'field_latest_score',
    question: 'What was your score / percentage in your most recent qualifying examination?',
    description: 'Merit schemes typically require a minimum percentage (e.g. 80% percentile or 60%+ marks).',
    inputType: 'number',
    placeholder: 'e.g. 78.5',
    allowUnknown: true,
    priority: 82,
    informationValue: 9,
  },
  // 9. Class 12 Percentage
  {
    id: 'q_class_12_percentage',
    fieldId: 'field_class_12_percentage',
    question: 'What was your percentage in Class 12 / Higher Secondary?',
    description: 'Required by higher education scholarships that verify 12th board marks.',
    inputType: 'number',
    placeholder: 'e.g. 82.4',
    showWhen: [
      {
        field: 'field_education_level',
        operator: 'in',
        value: ['undergraduate', 'diploma'],
      },
    ],
    allowUnknown: true,
    priority: 78,
    informationValue: 9,
  },
  // 10. Institution State
  {
    id: 'q_institution_state',
    fieldId: 'field_institution_state',
    question: 'Where is your college or school located?',
    description: 'Determines whether state-level or national portal rules apply.',
    inputType: 'radio',
    options: fieldById['field_institution_state']?.options,
    priority: 75,
    informationValue: 8,
  },
  // 11. Institution Type
  {
    id: 'q_institution_type',
    fieldId: 'field_institution_type',
    question: 'What type of institution are you enrolled in?',
    description: 'Government, aided, self-financed, or central university.',
    inputType: 'select',
    options: fieldById['field_institution_type']?.options,
    priority: 70,
    informationValue: 7,
  },
  // 12. Minority Status
  {
    id: 'q_minority_status',
    fieldId: 'field_minority_status',
    question: 'Do you belong to a religious or linguistic minority community?',
    description: 'Such as Muslim, Christian, Sikh, Buddhist, Jain, or Parsi.',
    inputType: 'boolean',
    priority: 68,
    informationValue: 8,
  },
  // 13. Minority Community
  {
    id: 'q_minority_community',
    fieldId: 'field_minority_community',
    question: 'Which minority community do you belong to?',
    inputType: 'select',
    options: fieldById['field_minority_community']?.options,
    showWhen: [
      {
        field: 'field_minority_status',
        operator: 'is_true',
      },
    ],
    priority: 67,
    informationValue: 6,
  },
  // 14. Disability (PwD)
  {
    id: 'q_has_disability',
    fieldId: 'field_has_disability',
    question: 'Do you have a benchmark physical or sensory disability?',
    description: 'Disability recognized by medical authority (e.g. Saksham scholarship requires 40%+).',
    inputType: 'boolean',
    priority: 65,
    informationValue: 8,
  },
  // 15. Disability Percentage
  {
    id: 'q_disability_percentage',
    fieldId: 'field_disability_percentage',
    question: 'What is your certified disability percentage?',
    inputType: 'number',
    placeholder: 'e.g. 45',
    showWhen: [
      {
        field: 'field_has_disability',
        operator: 'is_true',
      },
    ],
    priority: 64,
    informationValue: 7,
  },
  // 16. Orphan Status
  {
    id: 'q_is_orphan',
    fieldId: 'field_is_orphan',
    question: 'Are you an orphan or ward of a state care home?',
    inputType: 'boolean',
    priority: 60,
    informationValue: 7,
  },
  // 17. Defence Dependent
  {
    id: 'q_is_defence_dependent',
    fieldId: 'field_is_defence_dependent',
    question: 'Are you a child or dependent of Armed Forces / Paramilitary personnel?',
    description: 'PMSS and specialized defence schemes provide dedicated financial quotas.',
    inputType: 'boolean',
    priority: 58,
    informationValue: 7,
  },
  // 18. Farmer Family
  {
    id: 'q_is_farmer_family',
    fieldId: 'field_is_farmer_family',
    question: 'Is your family primarily engaged in agriculture or small farming?',
    inputType: 'boolean',
    priority: 55,
    informationValue: 6,
  },
  // 19. First Generation Learner
  {
    id: 'q_is_first_generation_student',
    fieldId: 'field_is_first_generation_student',
    question: 'Are you the first member of your immediate family to pursue higher education?',
    inputType: 'boolean',
    priority: 50,
    informationValue: 5,
  },
  // 20. Accommodation Type
  {
    id: 'q_accommodation_type',
    fieldId: 'field_accommodation_type',
    question: 'What is your accommodation arrangement while studying?',
    description: 'Hostel allowances are provided by many schemes for students staying in hostels.',
    inputType: 'radio',
    options: fieldById['field_accommodation_type']?.options,
    priority: 45,
    informationValue: 6,
  },
  // 21. Income Certificate Available
  {
    id: 'q_has_income_certificate',
    fieldId: 'field_has_income_certificate',
    question: 'Do you possess a valid income certificate from the competent revenue authority?',
    inputType: 'boolean',
    priority: 40,
    informationValue: 6,
  },
  // 22. Hosteller Status
  {
    id: 'q_is_hosteller',
    fieldId: 'field_is_hosteller',
    question: 'Do you stay in a hostel or paying guest accommodation while studying?',
    description: 'Special hostel maintenance allowance is available for students living away from home.',
    inputType: 'boolean',
    priority: 46,
    informationValue: 6,
  },
  // 23. Hostel Type (Conditional on is_hosteller = true)
  {
    id: 'q_hostel_type',
    fieldId: 'field_hostel_type',
    question: 'What type of hostel facility do you live in?',
    description: 'Government/Samras hostels often have specific subsidy rules.',
    inputType: 'radio',
    options: fieldById['field_hostel_type']?.options,
    showWhen: [
      {
        field: 'field_is_hosteller',
        operator: 'is_true',
      },
    ],
    priority: 44,
    informationValue: 5,
  },
  // 24. Disability Type (Conditional on has_disability = true)
  {
    id: 'q_disability_type',
    fieldId: 'field_disability_type',
    question: 'What is the nature of your physical or sensory impairment?',
    inputType: 'select',
    options: fieldById['field_disability_type']?.options,
    showWhen: [
      {
        field: 'field_has_disability',
        operator: 'is_true',
      },
    ],
    priority: 63,
    informationValue: 6,
  },
  // 25. Sports Achievement
  {
    id: 'q_sports_achievement',
    fieldId: 'field_sports_achievement',
    question: 'Have you represented your school, college, district, state, or nation in sports competitions?',
    description: 'Sports quotas and talent awards provide direct fee waivers or financial grants.',
    inputType: 'boolean',
    priority: 45,
    informationValue: 6,
  },
  // 26. Academic Distinction / Olympiad
  {
    id: 'q_has_academic_achievement',
    fieldId: 'field_has_academic_achievement',
    question: 'Have you received any notable academic distinction, Olympiad rank, or state/national award?',
    description: 'Special merit and talent scholarships recognize exceptional academic track records.',
    inputType: 'boolean',
    priority: 45,
    informationValue: 6,
  },
  // 27. Research Experience
  {
    id: 'q_research_experience',
    fieldId: 'field_research_experience',
    question: 'Do you have published research papers or active participation in recognized research projects?',
    description: 'Higher education research fellowships and project grants support student researchers.',
    inputType: 'boolean',
    priority: 40,
    informationValue: 5,
  },
  // 28. School Education Board
  {
    id: 'q_board',
    fieldId: 'field_board',
    question: 'Which educational board did you complete your secondary or higher secondary school from?',
    description: 'Some scholarships are specific to state boards (e.g. GSEB) or central boards (CBSE/ICSE).',
    inputType: 'radio',
    options: fieldById['field_board']?.options,
    priority: 50,
    informationValue: 6,
  },
  // 29. Caste Certificate Available
  {
    id: 'q_has_caste_certificate',
    fieldId: 'field_has_caste_certificate',
    question: 'Do you possess a valid caste or community certificate issued by the competent authority?',
    description: 'Required for reserved category government scholarships.',
    inputType: 'boolean',
    priority: 40,
    informationValue: 5,
  },
  // 30. Domicile Certificate Available
  {
    id: 'q_has_domicile_certificate',
    fieldId: 'field_has_domicile_certificate',
    question: 'Do you possess a certified domicile certificate for your state of residence?',
    description: 'Required for state government merit and post-matric schemes.',
    inputType: 'boolean',
    priority: 40,
    informationValue: 5,
  },
  // 31. Institution Bonafide / Enrollment Certificate Available
  {
    id: 'q_has_institution_certificate',
    fieldId: 'field_has_institution_certificate',
    question: 'Do you have a bonafide or study certificate from your current educational institution?',
    description: 'Essential document verifying current regular student enrollment.',
    inputType: 'boolean',
    priority: 40,
    informationValue: 5,
  },
];

/**
 * Lookup map from question ID to question definition.
 */
export const questionById: Record<string, QuestionDefinition> = eligibilityQuestions.reduce(
  (acc, q) => {
    acc[q.id] = q;
    return acc;
  },
  {} as Record<string, QuestionDefinition>
);

/**
 * Lookup map from field ID to question definition.
 */
export const questionByFieldId: Record<string, QuestionDefinition> = eligibilityQuestions.reduce(
  (acc, q) => {
    acc[q.fieldId] = q;
    return acc;
  },
  {} as Record<string, QuestionDefinition>
);
