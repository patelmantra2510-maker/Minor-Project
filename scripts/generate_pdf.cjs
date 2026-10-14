const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const htmlPath = path.resolve(__dirname, '../docs/DATA_DICTIONARY.html');
const pdfOutputPath = path.resolve(__dirname, '../docs/EDVORA_DATA_DICTIONARY.pdf');
const artifactPdfPath = 'C:\\Users\\jethi\\.gemini\\antigravity\\brain\\7c13add3-0c17-4005-a828-8692c0b8a84f\\EDVORA_DATA_DICTIONARY.pdf';

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Edvora — Data Dictionary</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 14mm 12mm 14mm 12mm;
      @bottom-right {
        content: counter(page);
      }
    }
    
    * {
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1c1917;
      background: #ffffff;
      line-height: 1.45;
      font-size: 11px;
      margin: 0;
      padding: 0;
    }
    
    .cover-banner {
      background: linear-gradient(135deg, #064E3B 0%, #065F46 100%);
      color: #ffffff;
      padding: 24px;
      border-radius: 12px;
      margin-bottom: 24px;
      border-left: 6px solid #D97706;
    }
    
    .cover-title {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin: 0 0 6px 0;
      color: #FAF8F5;
    }
    
    .cover-subtitle {
      font-size: 13px;
      color: #D1FAE5;
      margin: 0 0 14px 0;
      font-weight: 500;
    }
    
    .meta-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    
    .badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 10px;
      font-weight: 600;
      background: rgba(255, 255, 255, 0.15);
      color: #FEF3C7;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    h2 {
      font-size: 15px;
      font-weight: 700;
      color: #064E3B;
      border-bottom: 2px solid #E5E7EB;
      padding-bottom: 5px;
      margin-top: 22px;
      margin-bottom: 10px;
      page-break-after: avoid;
    }
    
    h3 {
      font-size: 12px;
      font-weight: 700;
      color: #1F2937;
      margin-top: 14px;
      margin-bottom: 6px;
      page-break-after: avoid;
    }
    
    p {
      margin: 0 0 8px 0;
      color: #374151;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 14px;
      font-size: 10px;
      page-break-inside: auto;
    }
    
    tr {
      page-break-inside: avoid;
      page-break-after: auto;
    }
    
    th {
      background-color: #F3F4F6;
      color: #111827;
      font-weight: 700;
      text-align: left;
      padding: 6px 8px;
      border: 1px solid #D1D5DB;
      font-size: 9.5px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    
    td {
      padding: 5px 8px;
      border: 1px solid #E5E7EB;
      vertical-align: top;
    }
    
    tr:nth-child(even) td {
      background-color: #FAFAF9;
    }
    
    code {
      font-family: 'Consolas', 'Courier New', Courier, monospace;
      font-size: 9.5px;
      background-color: #F3F4F6;
      color: #065F46;
      padding: 1px 4px;
      border-radius: 4px;
      border: 1px solid #E5E7EB;
    }
    
    pre {
      background-color: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 10px 12px;
      font-family: 'Consolas', 'Courier New', Courier, monospace;
      font-size: 9.5px;
      color: #1E293B;
      overflow-x: auto;
      margin: 8px 0 12px 0;
      line-height: 1.4;
      page-break-inside: avoid;
    }
    
    .pk {
      font-weight: bold;
      color: #B45309;
    }
    
    .tag-blue {
      display: inline-block;
      padding: 1px 5px;
      border-radius: 4px;
      font-size: 9px;
      background: #EFF6FF;
      color: #1D4ED8;
      border: 1px solid #BFDBFE;
    }
    
    .tag-green {
      display: inline-block;
      padding: 1px 5px;
      border-radius: 4px;
      font-size: 9px;
      background: #ECFDF5;
      color: #047857;
      border: 1px solid #A7F3D0;
    }
    
    .tag-amber {
      display: inline-block;
      padding: 1px 5px;
      border-radius: 4px;
      font-size: 9px;
      background: #FFFBEB;
      color: #B45309;
      border: 1px solid #FDE68A;
    }
    
    .note-box {
      background-color: #F0FDF4;
      border: 1px solid #BBF7D0;
      border-left: 4px solid #059669;
      border-radius: 6px;
      padding: 10px 12px;
      margin: 10px 0;
      font-size: 10.5px;
      color: #065F46;
      page-break-inside: avoid;
    }
    
    .footer-note {
      text-align: center;
      font-size: 9px;
      color: #9CA3AF;
      margin-top: 30px;
      padding-top: 10px;
      border-top: 1px solid #E5E7EB;
    }
  </style>
</head>
<body>

  <!-- Cover Header -->
  <div class="cover-banner">
    <div class="cover-title">EDVORA — Comprehensive Data Dictionary</div>
    <div class="cover-subtitle">AI-Powered Scholarship Finder &amp; Document Assistant | Technical Specification</div>
    <div class="meta-badges">
      <span class="badge">Version 1.0.0</span>
      <span class="badge">Environment: Production</span>
      <span class="badge">Database: SQLite (WAL Mode)</span>
      <span class="badge">Client: LocalStorage Envelope v1</span>
      <span class="badge">Date: September 2026</span>
    </div>
  </div>

  <!-- Section 1 -->
  <h2>1. System Architecture &amp; Data Overview</h2>
  <p>Edvora implements a <strong>Privacy-First, Client-Centric &amp; Relational Hybrid Architecture</strong> designed to provide instant, verified scholarship eligibility matching for Indian students without requiring mandatory cloud registration or sensitive PII disclosure.</p>
  <ul>
    <li><strong>Client Storage (Browser LocalStorage &amp; SessionStorage)</strong>: Single source of truth for student answers, adaptive questionnaire session states, bookmarked scholarships, and comparison trays.</li>
    <li><strong>Embedded Database (SQLite via <code>better-sqlite3</code>)</strong>: Master repository of verified scholarships, eligibility rule groups, and administrative records with Write-Ahead Logging (WAL) concurrency.</li>
    <li><strong>Universal Field &amp; Question Registries</strong>: 65+ standardized eligibility fields categorized into 8 functional domains, driving the dynamic Candidate Engine and Eligibility Evaluator.</li>
  </ul>

  <!-- Section 2 -->
  <h2>2. Relational Database Schema (<code>database/edvora.sqlite</code>)</h2>
  <p>Managed via <code>server/db.cjs</code> and embedded Vite middleware for high-concurrency read/write operations.</p>
  <h3>Table: <code>scholarships</code> (Master Catalog)</h3>
  <table>
    <thead>
      <tr>
        <th>Column Name</th>
        <th>Type</th>
        <th>Null</th>
        <th>Key</th>
        <th>Constraints / Format</th>
        <th>Description &amp; Business Rules</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>id</code></td>
        <td><code>TEXT</code></td>
        <td>No</td>
        <td><span class="pk">PK</span></td>
        <td>Unique slug/ID</td>
        <td>Primary machine identifier (e.g. <code>mysy-scheme</code>, <code>cmss-gujarat</code>).</td>
      </tr>
      <tr>
        <td><code>slug</code></td>
        <td><code>TEXT</code></td>
        <td>No</td>
        <td><span class="tag-blue">UNIQUE</span></td>
        <td>URL-safe format</td>
        <td>Clean URL route path (e.g. <code>/scholarships/mysy-scheme</code>).</td>
      </tr>
      <tr>
        <td><code>name</code></td>
        <td><code>TEXT</code></td>
        <td>No</td>
        <td>-</td>
        <td>Non-empty string</td>
        <td>Full official scheme title.</td>
      </tr>
      <tr>
        <td><code>short_name</code></td>
        <td><code>TEXT</code></td>
        <td>No</td>
        <td>-</td>
        <td>Concise string</td>
        <td>Display acronym (e.g. <code>MYSY Gujarat</code>).</td>
      </tr>
      <tr>
        <td><code>provider</code></td>
        <td><code>TEXT</code></td>
        <td>No</td>
        <td>-</td>
        <td>Non-empty string</td>
        <td>Government department or foundation providing the fund.</td>
      </tr>
      <tr>
        <td><code>state</code></td>
        <td><code>TEXT</code></td>
        <td>No</td>
        <td><span class="tag-blue">INDEX</span></td>
        <td><code>'Gujarat' | 'All India'</code></td>
        <td>Territorial applicability constraint.</td>
      </tr>
      <tr>
        <td><code>type</code></td>
        <td><code>TEXT</code></td>
        <td>No</td>
        <td>-</td>
        <td>Enum string</td>
        <td>Category: <code>Government</code>, <code>Private</code>, <code>Merit</code>, <code>Need-based</code>.</td>
      </tr>
      <tr>
        <td><code>education_levels</code></td>
        <td><code>TEXT</code></td>
        <td>No</td>
        <td>-</td>
        <td>JSON String Array</td>
        <td>Target levels (e.g. <code>["Diploma", "Undergraduate"]</code>).</td>
      </tr>
      <tr>
        <td><code>courses</code></td>
        <td><code>TEXT</code></td>
        <td>No</td>
        <td>-</td>
        <td>JSON String Array</td>
        <td>Eligible academic streams or <code>["All"]</code>.</td>
      </tr>
      <tr>
        <td><code>categories</code></td>
        <td><code>TEXT</code></td>
        <td>No</td>
        <td>-</td>
        <td>JSON String Array</td>
        <td>Target social quotas: <code>General</code>, <code>SC</code>, <code>ST</code>, <code>SEBC/OBC</code>, <code>EWS</code>.</td>
      </tr>
      <tr>
        <td><code>gender_eligibility</code></td>
        <td><code>TEXT</code></td>
        <td>No</td>
        <td>-</td>
        <td><code>'All' | 'Female' | 'Male'</code></td>
        <td>Gender restriction parameter.</td>
      </tr>
      <tr>
        <td><code>income_limit</code></td>
        <td><code>REAL</code></td>
        <td>Yes</td>
        <td>-</td>
        <td>Numeric INR / NULL</td>
        <td>Annual family income ceiling (e.g. <code>600000.0</code>). NULL if no ceiling.</td>
      </tr>
      <tr>
        <td><code>minimum_percentage</code></td>
        <td><code>REAL</code></td>
        <td>Yes</td>
        <td>-</td>
        <td>0.0 to 100.0 / NULL</td>
        <td>Minimum qualifying percentage (e.g. <code>80.0</code> for MYSY).</td>
      </tr>
      <tr>
        <td><code>year_eligibility</code></td>
        <td><code>TEXT</code></td>
        <td>No</td>
        <td>-</td>
        <td>JSON String Array</td>
        <td>Enrolled years covered (e.g. <code>["1st Year", "All"]</code>).</td>
      </tr>
      <tr>
        <td><code>special_conditions</code></td>
        <td><code>TEXT</code></td>
        <td>Yes</td>
        <td>-</td>
        <td>JSON Object string</td>
        <td>Disability percentage, orphan status, minority flags, notes.</td>
      </tr>
      <tr>
        <td><code>benefits</code></td>
        <td><code>TEXT</code></td>
        <td>No</td>
        <td>-</td>
        <td>JSON Object string</td>
        <td>Coverage description, tuition subsidy, book &amp; hostel allowance.</td>
      </tr>
      <tr>
        <td><code>application_start</code></td>
        <td><code>TEXT</code></td>
        <td>No</td>
        <td>-</td>
        <td>ISO Date (YYYY-MM-DD)</td>
        <td>Opening date of registration portal.</td>
      </tr>
      <tr>
        <td><code>application_deadline</code></td>
        <td><code>TEXT</code></td>
        <td>No</td>
        <td>-</td>
        <td>ISO Date (YYYY-MM-DD)</td>
        <td>Application submission cut-off date.</td>
      </tr>
      <tr>
        <td><code>status</code></td>
        <td><code>TEXT</code></td>
        <td>No</td>
        <td><span class="tag-blue">INDEX</span></td>
        <td><code>'Open' | 'Opening Soon' | 'Closed'</code></td>
        <td>Current operational status of scholarship portal.</td>
      </tr>
      <tr>
        <td><code>documents</code></td>
        <td><code>TEXT</code></td>
        <td>No</td>
        <td>-</td>
        <td>JSON String Array</td>
        <td>List of mandatory self-attested certificates required.</td>
      </tr>
      <tr>
        <td><code>description</code></td>
        <td><code>TEXT</code></td>
        <td>No</td>
        <td>-</td>
        <td>Full text</td>
        <td>Detailed overview of the scheme benefits and guidelines.</td>
      </tr>
      <tr>
        <td><code>who_can_apply</code></td>
        <td><code>TEXT</code></td>
        <td>No</td>
        <td>-</td>
        <td>JSON String Array</td>
        <td>Bulleted summary of student criteria.</td>
      </tr>
      <tr>
        <td><code>how_to_apply_steps</code></td>
        <td><code>TEXT</code></td>
        <td>No</td>
        <td>-</td>
        <td>JSON String Array</td>
        <td>Sequential instructions for online application.</td>
      </tr>
      <tr>
        <td><code>official_website</code></td>
        <td><code>TEXT</code></td>
        <td>No</td>
        <td>-</td>
        <td>Valid URL string</td>
        <td>Informational official government portal link.</td>
      </tr>
      <tr>
        <td><code>application_website</code></td>
        <td><code>TEXT</code></td>
        <td>No</td>
        <td>-</td>
        <td>Valid URL string</td>
        <td>Direct application submission portal link.</td>
      </tr>
      <tr>
        <td><code>last_updated</code></td>
        <td><code>TEXT</code></td>
        <td>No</td>
        <td>-</td>
        <td>ISO Date string</td>
        <td>Date of rule verification and metadata audit.</td>
      </tr>
      <tr>
        <td><code>tags</code></td>
        <td><code>TEXT</code></td>
        <td>No</td>
        <td>-</td>
        <td>JSON String Array</td>
        <td>Search indexing tags and keywords.</td>
      </tr>
      <tr>
        <td><code>is_verified</code></td>
        <td><code>INTEGER</code></td>
        <td>No</td>
        <td>-</td>
        <td><code>0 | 1 (DEFAULT 1)</code></td>
        <td>Audit verification flag.</td>
      </tr>
      <tr>
        <td><code>is_featured</code></td>
        <td><code>INTEGER</code></td>
        <td>No</td>
        <td>-</td>
        <td><code>0 | 1 (DEFAULT 0)</code></td>
        <td>Promoted placement on homepage showcase.</td>
      </tr>
      <tr>
        <td><code>created_at</code></td>
        <td><code>DATETIME</code></td>
        <td>No</td>
        <td>-</td>
        <td><code>CURRENT_TIMESTAMP</code></td>
        <td>Timestamp of record creation in database.</td>
      </tr>
    </tbody>
  </table>

  <!-- Section 3 -->
  <h2>3. Client Storage Envelopes (Browser LocalStorage &amp; SessionStorage)</h2>
  <table>
    <thead>
      <tr>
        <th>Storage Key</th>
        <th>Engine</th>
        <th>Data Structure</th>
        <th>Lifecycle</th>
        <th>Purpose &amp; Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>edvora_student_profile_v1</code></td>
        <td><code>localStorage</code></td>
        <td><code>StoredProfileEnvelope</code></td>
        <td>Persistent across sessions</td>
        <td>Primary student profile, answered fields dictionary, readiness percentage.</td>
      </tr>
      <tr>
        <td><code>edvora_questionnaire_state_v1</code></td>
        <td><code>localStorage</code></td>
        <td><code>StoredQuestionnaireEnvelope</code></td>
        <td>Persistent</td>
        <td>Progress stack, current question ID, asked/skipped question history.</td>
      </tr>
      <tr>
        <td><code>edvora_saved_ids</code></td>
        <td><code>localStorage</code></td>
        <td><code>string[]</code> (JSON Array)</td>
        <td>Persistent</td>
        <td>List of bookmarked scholarship IDs chosen by student.</td>
      </tr>
      <tr>
        <td><code>edvora_recent_ids</code></td>
        <td><code>localStorage</code></td>
        <td><code>string[]</code> (JSON Array)</td>
        <td>Persistent</td>
        <td>Last 10 viewed scholarship slugs for quick return.</td>
      </tr>
      <tr>
        <td><code>edvora_compare_ids</code></td>
        <td><code>localStorage</code></td>
        <td><code>string[]</code> (JSON Array)</td>
        <td>Persistent</td>
        <td>Active comparison tray items (strictly capped at 3).</td>
      </tr>
      <tr>
        <td><code>edvora_lang</code></td>
        <td><code>localStorage</code></td>
        <td><code>'en' | 'hi' | 'gu'</code></td>
        <td>Persistent</td>
        <td>Active user language preference (English, Hindi, Gujarati).</td>
      </tr>
      <tr>
        <td><code>theme</code></td>
        <td><code>localStorage</code></td>
        <td><code>'light' | 'dark' | 'system'</code></td>
        <td>Persistent</td>
        <td>User UI color theme preference.</td>
      </tr>
      <tr>
        <td><code>edvora_find_search_prefs</code></td>
        <td><code>sessionStorage</code></td>
        <td><code>SearchPreferences</code> (JSON)</td>
        <td>Tab session only</td>
        <td>Active search keyword, education filter, and open-only toggle on <code>/find</code>.</td>
      </tr>
    </tbody>
  </table>

  <!-- Section 4 -->
  <h2>4. Core Application Data Models (TypeScript Interfaces)</h2>
  
  <h3>Model: <code>StudentProfile</code> &amp; <code>StudentFieldValue</code></h3>
  <pre><code>export interface StudentProfile {
  id: string;                                   // Unique Profile ID ("guest_xxx")
  profileType: 'guest' | 'registered';          // Zero-login by default
  userId?: string;                              // Optional foreign key for future auth
  createdAt: string;                            // ISO 8601 Timestamp
  updatedAt: string;                            // ISO 8601 Timestamp
  lastActiveAt?: string;                        // ISO 8601 Timestamp
  fields: Record&lt;string, StudentFieldValue&gt;;     // Keyed by FieldRegistry ID
  preferences: {
    language: 'en' | 'hi' | 'gu';
    theme: 'light' | 'dark' | 'system';
    desiredSupportTypes?: string[];
  };
  profileCompletion?: {
    percentage: number;                         // 0 to 100
    knownFields: number;                        // Total confirmed fields
    relevantFields: number;                     // Total relevant candidate fields
  };
}

export interface StudentFieldValue {
  value: string | number | boolean | string[] | null;
  status: 'known' | 'unknown' | 'not_applicable' | 'prefer_not_to_say' | 'custom';
  updatedAt: string;                            // ISO 8601 Timestamp
  source: 'questionnaire' | 'profile' | 'import' | 'admin' | 'system';
  customText?: string;                          // Retains custom text for "Other" options
}</code></pre>

  <!-- Section 5 -->
  <h2>5. Universal Eligibility Field Registry (65+ Fields)</h2>
  <p>The foundational field dictionary (<code>src/data/eligibility/fields.ts</code>) standardizes all attributes evaluated across schemes.</p>

  <h3>5.1 Category: Demographic</h3>
  <table>
    <thead>
      <tr>
        <th>Field ID</th>
        <th>Field Key</th>
        <th>Data Type</th>
        <th>Weight</th>
        <th>Allowed Values / Range</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr><td><code>field_age</code></td><td><code>age</code></td><td><code>number</code></td><td>5</td><td>3 to 100</td><td>Completed age in years.</td></tr>
      <tr><td><code>field_date_of_birth</code></td><td><code>dateOfBirth</code></td><td><code>date</code></td><td>4</td><td>ISO Date</td><td>Official date of birth as per 10th marksheet.</td></tr>
      <tr><td><code>field_gender</code></td><td><code>gender</code></td><td><code>single_select</code></td><td>8</td><td><code>female, male, transgender, other</code></td><td>Applicant gender identity.</td></tr>
      <tr><td><code>field_nationality</code></td><td><code>nationality</code></td><td><code>single_select</code></td><td>7</td><td><code>indian, nri, foreign_national</code></td><td>Citizenship status.</td></tr>
      <tr><td><code>field_religion</code></td><td><code>religion</code></td><td><code>single_select</code></td><td>6</td><td><code>hindu, muslim, christian, sikh, buddhist, jain, parsi, other</code></td><td>Religious identity for minority schemes.</td></tr>
      <tr><td><code>field_minority_community</code></td><td><code>minorityCommunity</code></td><td><code>boolean</code></td><td>8</td><td><code>true, false</code></td><td>Belonging to notified religious minority.</td></tr>
      <tr><td><code>field_single_girl_child</code></td><td><code>singleGirlChild</code></td><td><code>boolean</code></td><td>7</td><td><code>true, false</code></td><td>Only girl child in family (AICTE Pragati).</td></tr>
      <tr><td><code>field_is_first_graduate</code></td><td><code>isFirstGraduate</code></td><td><code>boolean</code></td><td>5</td><td><code>true, false</code></td><td>First person in family pursuing higher degree.</td></tr>
    </tbody>
  </table>

  <h3>5.2 Category: Location &amp; Domicile</h3>
  <table>
    <thead>
      <tr>
        <th>Field ID</th>
        <th>Field Key</th>
        <th>Data Type</th>
        <th>Weight</th>
        <th>Allowed Values / Range</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr><td><code>field_domicile_state</code></td><td><code>domicileState</code></td><td><code>single_select</code></td><td><strong>10</strong></td><td><code>gujarat, other_state</code></td><td>State holding valid domicile certificate.</td></tr>
      <tr><td><code>field_current_state</code></td><td><code>currentState</code></td><td><code>single_select</code></td><td>8</td><td>All Indian State Names</td><td>Current living location of student.</td></tr>
      <tr><td><code>field_permanent_state</code></td><td><code>permanentState</code></td><td><code>single_select</code></td><td>8</td><td>All Indian State Names</td><td>Permanent home state address.</td></tr>
      <tr><td><code>field_domicile_district</code></td><td><code>domicileDistrict</code></td><td><code>text</code></td><td>2</td><td>District name string</td><td>District of domicile certificate.</td></tr>
      <tr><td><code>field_rural_urban</code></td><td><code>ruralUrban</code></td><td><code>single_select</code></td><td>4</td><td><code>rural, urban, semi_urban</code></td><td>Demographic classification of area.</td></tr>
    </tbody>
  </table>

  <h3>5.3 Category: Education Level &amp; Course</h3>
  <table>
    <thead>
      <tr>
        <th>Field ID</th>
        <th>Field Key</th>
        <th>Data Type</th>
        <th>Weight</th>
        <th>Allowed Values / Range</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr><td><code>field_education_level</code></td><td><code>educationLevel</code></td><td><code>single_select</code></td><td><strong>10</strong></td><td><code>school, diploma, iti, undergraduate, postgraduate, phd, other</code></td><td>Current educational tier.</td></tr>
      <tr><td><code>field_stream</code></td><td><code>stream</code></td><td><code>single_select</code></td><td>9</td><td><code>engineering_technology, medicine_health_sciences, pure_applied_sciences, commerce_management, arts_humanities, law_legal_studies, pharmacy, agriculture_allied, polytechnic_diploma, vocational_iti, general, other</code></td><td>Academic discipline stream.</td></tr>
      <tr><td><code>field_program</code></td><td><code>program</code></td><td><code>text</code></td><td>7</td><td>Text (e.g. "B.Tech", "B.Sc")</td><td>Specific degree or course title.</td></tr>
      <tr><td><code>field_academic_year</code></td><td><code>academicYear</code></td><td><code>single_select</code></td><td>8</td><td><code>1st_year, 2nd_year, 3rd_year, 4th_year, 5th_year</code></td><td>Current enrolled study year.</td></tr>
      <tr><td><code>field_institution_type</code></td><td><code>institutionType</code></td><td><code>single_select</code></td><td>8</td><td><code>government, government_aided, private_self_financed, deemed_university, autonomous, other</code></td><td>College administrative governance.</td></tr>
      <tr><td><code>field_institution_state</code></td><td><code>institutionState</code></td><td><code>single_select</code></td><td>8</td><td><code>gujarat, other_state</code></td><td>State where college is physically located.</td></tr>
    </tbody>
  </table>

  <h3>5.4 Category: Academic Performance</h3>
  <table>
    <thead>
      <tr>
        <th>Field ID</th>
        <th>Field Key</th>
        <th>Data Type</th>
        <th>Weight</th>
        <th>Allowed Values / Range</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr><td><code>field_latest_score</code></td><td><code>latestScore</code></td><td><code>number</code></td><td>9</td><td>0.0 to 100.0 (%)</td><td>Percentage in most recent qualifying exam.</td></tr>
      <tr><td><code>field_class_10_percentage</code></td><td><code>class10Percentage</code></td><td><code>number</code></td><td>7</td><td>0.0 to 100.0 (%)</td><td>10th Board marks (Diploma admissions).</td></tr>
      <tr><td><code>field_class_12_percentage</code></td><td><code>class12Percentage</code></td><td><code>number</code></td><td>8</td><td>0.0 to 100.0 (%)</td><td>12th Board score (MYSY cutoff: &ge;80%).</td></tr>
      <tr><td><code>field_backlog_count</code></td><td><code>backlogCount</code></td><td><code>number</code></td><td>6</td><td>0 to 20</td><td>Current active ATKT / backlog count.</td></tr>
      <tr><td><code>field_qualifying_exam</code></td><td><code>qualifyingExam</code></td><td><code>single_select</code></td><td>6</td><td><code>gujcet, jee_main, neet, gate, cat, other, none</code></td><td>Competitive entrance test taken.</td></tr>
    </tbody>
  </table>

  <h3>5.5 Category: Social Category &amp; Financial Need</h3>
  <table>
    <thead>
      <tr>
        <th>Field ID</th>
        <th>Field Key</th>
        <th>Data Type</th>
        <th>Weight</th>
        <th>Allowed Values / Range</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr><td><code>field_category</code></td><td><code>category</code></td><td><code>single_select</code></td><td><strong>10</strong></td><td><code>general, sc, st, sebc_obc, ews, other</code></td><td>Social quota entitlement category.</td></tr>
      <tr><td><code>field_family_income</code></td><td><code>familyIncome</code></td><td><code>currency</code></td><td><strong>10</strong></td><td>&ge; 0 INR per annum</td><td>Gross annual family income.</td></tr>
      <tr><td><code>field_income_certificate</code></td><td><code>incomeCertificate</code></td><td><code>boolean</code></td><td>8</td><td><code>true, false</code></td><td>Mamlatdar / TDO income certificate.</td></tr>
      <tr><td><code>field_caste_certificate</code></td><td><code>casteCertificate</code></td><td><code>boolean</code></td><td>8</td><td><code>true, false</code></td><td>Competent authority caste certificate.</td></tr>
      <tr><td><code>field_bpl_status</code></td><td><code>bplStatus</code></td><td><code>boolean</code></td><td>7</td><td><code>true, false</code></td><td>Below Poverty Line card holder.</td></tr>
      <tr><td><code>field_ration_card_type</code></td><td><code>rationCardType</code></td><td><code>single_select</code></td><td>5</td><td><code>antodaya_aay, bpl, apl_1, apl_2, none</code></td><td>Food security ration card category.</td></tr>
    </tbody>
  </table>

  <h3>5.6 Category: Special Circumstances &amp; Quotas</h3>
  <table>
    <thead>
      <tr>
        <th>Field ID</th>
        <th>Field Key</th>
        <th>Data Type</th>
        <th>Weight</th>
        <th>Allowed Values / Range</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr><td><code>field_has_disability</code></td><td><code>hasDisability</code></td><td><code>boolean</code></td><td>9</td><td><code>true, false</code></td><td>Persons with Disabilities (PwD) flag.</td></tr>
      <tr><td><code>field_disability_percentage</code></td><td><code>disabilityPercentage</code></td><td><code>number</code></td><td>8</td><td>0 to 100 (%)</td><td>Certified medical disability percentage (&ge;40%).</td></tr>
      <tr><td><code>field_disability_type</code></td><td><code>disabilityType</code></td><td><code>single_select</code></td><td>7</td><td><code>locomotor, visual, hearing, speech, intellectual, multiple, other</code></td><td>Medical categorization.</td></tr>
      <tr><td><code>field_is_orphan</code></td><td><code>isOrphan</code></td><td><code>boolean</code></td><td>8</td><td><code>true, false</code></td><td>Deceased parents circumstance.</td></tr>
      <tr><td><code>field_is_single_parent</code></td><td><code>isSingleParent</code></td><td><code>boolean</code></td><td>6</td><td><code>true, false</code></td><td>Single parent family background.</td></tr>
      <tr><td><code>field_is_defence_ward</code></td><td><code>isDefenceWard</code></td><td><code>boolean</code></td><td>7</td><td><code>true, false</code></td><td>Child of armed forces / ex-servicemen.</td></tr>
      <tr><td><code>field_is_farmer_ward</code></td><td><code>isFarmerWard</code></td><td><code>boolean</code></td><td>6</td><td><code>true, false</code></td><td>Child of registered agriculturalist.</td></tr>
    </tbody>
  </table>

  <!-- Section 6 -->
  <h2>6. Rule Engine Operators &amp; Evaluation Semantics</h2>
  <table>
    <thead>
      <tr>
        <th>Operator</th>
        <th>Syntax Pattern</th>
        <th>Supported Types</th>
        <th>Evaluation Semantics</th>
      </tr>
    </thead>
    <tbody>
      <tr><td><code>equals</code></td><td><code>field == value</code></td><td>string, number, boolean</td><td>Strict equality comparison (case-insensitive for strings).</td></tr>
      <tr><td><code>not_equals</code></td><td><code>field != value</code></td><td>string, number, boolean</td><td>Value must not equal specified parameter.</td></tr>
      <tr><td><code>greater_than_or_equal</code></td><td><code>field &gt;= value</code></td><td>number, currency</td><td>Numeric satisfies threshold (e.g. marks &ge; 80%).</td></tr>
      <tr><td><code>less_than_or_equal</code></td><td><code>field &lt;= value</code></td><td>number, currency</td><td>Numeric satisfies ceiling (e.g. income &le; ₹2,50,000).</td></tr>
      <tr><td><code>between</code></td><td><code>min &lt;= field &lt;= max</code></td><td>number, currency</td><td>Value falls within continuous range bounds.</td></tr>
      <tr><td><code>in</code></td><td><code>value[].includes(field)</code></td><td>string, number</td><td>Value matches at least one item in approved set.</td></tr>
      <tr><td><code>not_in</code></td><td><code>!value[].includes(field)</code></td><td>string, number</td><td>Value is excluded from prohibited set.</td></tr>
      <tr><td><code>contains</code></td><td><code>field.includes(substr)</code></td><td>string, string[]</td><td>Collection or string contains specified substring.</td></tr>
      <tr><td><code>is_true</code></td><td><code>field === true</code></td><td>boolean</td><td>Evaluates boolean truthiness (1, true, 'true').</td></tr>
      <tr><td><code>is_false</code></td><td><code>field === false</code></td><td>boolean</td><td>Evaluates boolean falsiness (0, false, 'false').</td></tr>
    </tbody>
  </table>

  <!-- Section 7 -->
  <h2>7. Data Privacy, Integrity &amp; Security Policy</h2>
  <div class="note-box">
    <strong>Zero-PII Enforcement Rule:</strong> Edvora strictly prohibits collecting, requesting, or storing:
    <ul>
      <li>12-digit Government Aadhaar numbers</li>
      <li>Bank account numbers, IFSC codes, or ATM credentials</li>
      <li>Portal passwords or login OTPs</li>
    </ul>
    All identity tracking is maintained exclusively through pseudonymized local session identifiers (<code>guest_xxx</code>).
  </div>
  <ul>
    <li><strong>Isolated Reset</strong>: Calling <code>clearProfile()</code> purges answers while preserving saved scholarships and comparison trays.</li>
    <li><strong>Multi-Tier Recovery</strong>: Automatically cleans and restores malformed local data without application crashing.</li>
  </ul>

  <div class="footer-note">
    Edvora Engineering Project Documentation | Generated September 2026 | Certified Production Data Dictionary
  </div>

</body>
</html>
`;

fs.writeFileSync(htmlPath, htmlContent, 'utf-8');
console.log('HTML written to ' + htmlPath);

try {
  console.log('Generating PDF using Microsoft Edge...');
  const cmd = `"${edgePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${pdfOutputPath}" --no-pdf-header-footer "${htmlPath}"`;
  execSync(cmd, { stdio: 'inherit' });
  console.log('PDF generated at ' + pdfOutputPath);

  // Copy to artifact directory
  fs.copyFileSync(pdfOutputPath, artifactPdfPath);
  console.log('PDF copied to artifact directory: ' + artifactPdfPath);
} catch (err) {
  console.error('Error generating PDF:', err);
  process.exit(1);
}
