from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field

EducationLevel = Literal[
    'School',
    'Diploma',
    'ITI',
    'Undergraduate',
    'Postgraduate',
    'PhD',
    'Other'
]

SocialCategory = Literal[
    'General',
    'SC',
    'ST',
    'SEBC/OBC',
    'EWS',
    'Other',
    'Prefer not to say',
    'All'
]

Gender = Literal['Male', 'Female', 'Other', 'Prefer not to say', 'All']

ScholarshipType = Literal[
    'Merit',
    'Need-based',
    'Government',
    'Private',
    'Technical',
    'Category-based',
    'Special'
]

ApplicationStatus = Literal[
    'Open',
    'Opening Soon',
    'Upcoming',
    'Closing Soon',
    'Closed',
    'Renewal Open',
    'Dates Not Announced'
]

ReviewStatus = Literal[
    'verified',
    'pending_review',
    'flagged_for_review',
    'rejected'
]

class ScholarshipBenefitsModel(BaseModel):
    amountDescription: str = ""
    tuitionFeeCoverage: Optional[str] = None
    bookAllowance: Optional[str] = None
    hostelAllowance: Optional[str] = None
    maxAnnualAmount: Optional[int] = 0

class ScholarshipSpecialConditionsModel(BaseModel):
    disabilityRequired: Optional[bool] = False
    minDisabilityPercentage: Optional[int] = None
    orphanRequired: Optional[bool] = False
    defenceWardRequired: Optional[bool] = False
    minorityRequired: Optional[bool] = False
    requiresVerification: Optional[bool] = False
    verificationNote: Optional[str] = None

class ExtractedScholarship(BaseModel):
    """
    Normalized scholarship payload extracted from official sources.
    Strictly forbids invented data.
    """
    id: str
    slug: str
    name: str
    shortName: str
    provider: str
    state: Literal['Gujarat', 'All India'] = 'All India'
    type: ScholarshipType = 'Government'
    educationLevels: List[EducationLevel] = Field(default_factory=lambda: ['Undergraduate'])
    courses: List[str] = Field(default_factory=lambda: ['All'])
    categories: List[SocialCategory] = Field(default_factory=lambda: ['All'])
    genderEligibility: Gender = 'All'
    incomeLimit: Optional[int] = None
    minimumPercentage: Optional[float] = None
    yearEligibility: List[str] = Field(default_factory=lambda: ['All'])
    specialConditions: Optional[ScholarshipSpecialConditionsModel] = None
    benefits: ScholarshipBenefitsModel
    applicationStart: str = ""
    applicationDeadline: str = ""
    status: ApplicationStatus = 'Dates Not Announced'
    documents: List[str] = Field(default_factory=list)
    description: str
    whoCanApply: List[str] = Field(default_factory=list)
    howToApplySteps: List[str] = Field(default_factory=list)
    officialWebsite: str
    applicationWebsite: str
    lastUpdated: str
    tags: List[str] = Field(default_factory=list)
    
    # Intelligence Metadata
    sourceUrl: str
    sourceDomain: str
    academicYear: Optional[str] = None
    renewalConditions: Optional[str] = None
    officialContact: Optional[str] = None
    rawHash: Optional[str] = None
    isVerified: bool = True
    reviewStatus: ReviewStatus = 'verified'
    verificationNotes: Optional[str] = None

class IntelligenceRunRecord(BaseModel):
    id: Optional[int] = None
    startedAt: str
    completedAt: Optional[str] = None
    status: Literal['running', 'success', 'failed', 'partial'] = 'running'
    sourcesChecked: int = 0
    discoveredCount: int = 0
    updatedCount: int = 0
    unchangedCount: int = 0
    failedSources: List[str] = Field(default_factory=list)
    logSummary: str = ""
    triggerType: Literal['scheduled', 'manual'] = 'scheduled'

class SourceHealthRecord(BaseModel):
    id: str
    name: str
    url: str
    sourceType: str
    priority: int = 1
    isActive: bool = True
    lastScannedAt: Optional[str] = None
    lastStatus: Literal['ok', 'error', 'blocked', 'pending'] = 'pending'
    errorMessage: Optional[str] = None
    schemesCount: int = 0

class IntelligenceStatusResponse(BaseModel):
    isSchedulerActive: bool
    intervalHours: int
    lastRun: Optional[Dict[str, Any]] = None
    nextScheduledRun: Optional[str] = None
    totalSources: int
    activeSources: int
    totalScholarshipsInDb: int
    verifiedCount: int
    flaggedCount: int
    sources: List[SourceHealthRecord]
    recentRuns: List[Dict[str, Any]]
