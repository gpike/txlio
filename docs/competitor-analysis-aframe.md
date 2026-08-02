# Competitor Analysis: AFrameSoftware

## Executive summary

AFrameSoftware positions itself as a combined real-estate transaction-management and CRM platform (a “T/CRM”) for transaction coordinators, agents, and brokerages. Its advantage is not one novel feature; it is the breadth and connectedness of the operating system around a transaction: contacts, records, tasks, reusable workflows, communications, client portals, team permissions, reporting, and integrations.

Txlio is currently much narrower and earlier-stage. Its strongest working capability is document-first contract intake: upload a Colorado CBS1 PDF, extract property details and deadlines, review uncertain data, and export a branded timeline. That creates a credible wedge AFrame does not emphasize publicly: turning a signed contract into structured, source-linked transaction data with minimal manual setup.

The recommended strategy is therefore **not to copy AFrame feature-for-feature**. Txlio should first make its extraction workflow persistent and operational, then extend it into deadline execution, stakeholder visibility, and team collaboration. CRM breadth, bulk marketing, and highly configurable analytics should come later.

The highest-value sequence is:

1. Persist extracted transactions, source documents, edits, and review status.
2. Turn extracted dates into assignable tasks, reminders, and calendar events.
3. Add an operational transaction grid with saved views, filters, and inline edits.
4. Add branded, permissioned timeline portals for agents, buyers, and sellers.
5. Add reusable transaction/action-plan templates and event-triggered communications.
6. Add team roles, managed-agent access, reporting, and integrations.

This sequence preserves Txlio’s differentiation—fast, intelligent contract ingestion—while progressively covering the functionality that makes AFrame useful every day.

## Scope and evidence

This analysis is based on AFrameSoftware’s public website rather than access to its authenticated application. Product claims below are therefore verified marketing claims, not independent hands-on validation.

Txlio’s current-state assessment is based on the repository at `/Users/gpike/projects/txlio`.

### Official AFrame sources reviewed

- [Home](https://www.aframesoftware.com/)
- [Features](https://www.aframesoftware.com/features/)
- [Transaction Coordinators](https://www.aframesoftware.com/transaction-coordinators/)
- [Brokers](https://www.aframesoftware.com/brokers/)
- [Pricing](https://www.aframesoftware.com/pricing/)
- [FAQs](https://www.aframesoftware.com/faqs/)
- [Feature Update: Flex Codes](https://www.aframesoftware.com/feature-update-flex-codes/)
- [Feature Update: Batch Emails](https://www.aframesoftware.com/feature-update-batch-emails/)
- [Feature Update: Analytics & Team Member Groups](https://www.aframesoftware.com/feature-update-analytics-team-member-groups/)
- [Feature Update: Custom Date Fields in Transaction Search](https://www.aframesoftware.com/feature-update-custom-date-fields-in-transaction-search/)

## Txlio today

### Implemented or scaffolded

| Area | Current Txlio capability | Evidence |
| --- | --- | --- |
| Authentication | Clerk-backed login, signup, route protection, and account identity | `src/app/(auth)/`, `middleware.js`, `src/lib/auth.js` |
| Contract intake | PDF upload and server-side processing | `src/app/(platform)/timeline/new/page.js`, `src/app/api/timeline/route.js` |
| Document intelligence | Extracts machine-readable or OCR-derived contract text, property address, absolute dates, relative deadlines, confidence, source snippets, and source page numbers | `src/core/readPdf.js`, `src/core/ocrPdf.js`, `src/core/timelineParser.js` |
| Human review | Editable event names and dates; uncertain entries are flagged for review | `src/app/(platform)/timeline/[id]/page.js` |
| Output | Generates a branded timeline PDF from reviewed entries | `src/core/exportTimelinePdf.js`, `src/core/outputTemplates.js` |
| Platform shell | Dashboard, timeline area, settings, and placeholder product expansion | `src/app/(platform)/`, `src/components/platform/Sidebar.js` |
| Data layer | Supabase client exists, but transaction persistence is still TODO | `src/lib/db.js`, timeline API routes |

### Important current limitations

- Uploaded transactions and edits are not persisted in Supabase.
- The transaction list is an empty-state placeholder.
- API routes reprocess a locally stored PDF by ID; there is no durable transaction record or object storage.
- There is no organization/team tenancy model, ownership model, or role-based authorization.
- Extracted deadlines do not yet become assignable tasks, reminders, or calendar events.
- Branding is hard-coded to one realtor template rather than organization settings.
- There are no contacts, reusable workflows, communication history, portals, analytics, or external integrations.
- The upload UI says scanned PDFs are unsupported even though OCR-related core code exists; the product path and messaging should be aligned after end-to-end validation.

## AFrame capability inventory

### 1. Transaction management

AFrame publicly claims:

- Centralized listings and contracts.
- Unlimited transactions and storage.
- Customized transaction templates.
- Simple or complex task/action plans.
- Document templates for consistency and compliance.
- Custom fields for arbitrary transaction data.
- Automatic task assignment and deadline tracking.
- Record ownership and visibility into transaction status.
- Transaction search with configurable fields, filters, and date columns.

**Why it matters:** AFrame turns a transaction into a durable operational record, while Txlio currently produces a timeline from a file. This is the largest functional gap and the foundation for almost every later feature.

### 2. Workflow automation and templates

AFrame publicly claims:

- Prebuilt and customizable action plans.
- Reusable transaction setup templates.
- Role-based automatic task assignment.
- Automatic date calculation and calendar synchronization.
- Email and letter templates tied to tasks.
- Merge fields for transaction/contact data.
- “Flex Codes” that conditionally render template content based on transaction data.
- Real-time updates across shared workflows.

**Why it matters:** Templates convert domain expertise into repeatable operations. Txlio already extracts the dates that could trigger these workflows, giving it a natural path to automation without asking users to configure every transaction manually.

### 3. CRM and relationship management

AFrame publicly claims:

- Contacts linked to listings, contracts, and transactions.
- Contact categories and relationship ratings.
- Individual or shared contact ownership.
- Anniversary and milestone “touch date” reminders.
- Advanced search across contacts and transactions.
- Targeted mass email.

**Why it matters:** This extends the product from transaction execution into referral and repeat-business management. It broadens the market but is not required to prove Txlio’s initial transaction-operations value.

### 4. Operational dashboards and saved views

AFrame publicly claims:

- Separate dashboards for contacts, transactions, and tasks.
- Configurable columns and data fields.
- Flexible filters and saved views.
- Inline viewing and editing of custom transaction dates.
- Completion toggles in the transaction grid.
- Formula/logic visibility on hover.
- A workflow in which users can operate transactions directly from the grid.

**Why it matters:** A generated timeline is useful once; an operational grid is useful every day. This is one of the best near-term retention features for Txlio.

### 5. Client and agent portals

AFrame publicly claims:

- Branded portals for agents, buyers, and sellers.
- Selective sharing of dates, tasks, attachments, marketing activity, showings, and feedback.
- Per-transaction control over what a portal user can see.
- Real-time transaction status visibility.
- Reduced email back-and-forth through shared access.

**Why it matters:** Txlio already creates a client-friendly timeline. A secure web portal is a direct extension of that asset and a better strategic fit than building a broad CRM first.

### 6. Team management and permissions

AFrame publicly claims:

- Multi-user team architecture.
- Assignment of transactions, contacts, and tasks.
- Tracking of record creator and owner.
- Role-based permissions and visibility controls.
- Team Member Groups, with users belonging to multiple groups.
- Team- and individual-level reporting.
- Managed agents who can be attached to transactions without a paid full-access seat.

**Why it matters:** This is essential for transaction-coordinator companies and brokerages. The managed-agent model is especially relevant because a TC may serve many agents but should not be forced to buy a full seat for every client.

### 7. Reporting and analytics

AFrame publicly claims:

- Active pipeline and production reporting.
- Performance by agent, transaction coordinator, team, and group.
- Date-range, prior-period, and prior-year comparisons.
- Deal progression, close rates, fallout, volume, commission, and timeline KPIs.
- Customizable drag-and-drop analytics dashboards.
- Shareable/client-facing production reports for independent transaction coordinators.
- Identification of operational bottlenecks.

**Why it matters:** These features help managers prove value and improve processes, but Txlio needs durable transaction history before they become meaningful.

### 8. Email and communication

AFrame publicly claims:

- Connected Gmail and Outlook sending.
- Transaction email and letter templates.
- Personalized merge fields and conditional Flex Codes.
- Batch email creation from scratch, drafts, or prior batches.
- Per-recipient preview before sending.
- Immediate or scheduled sends.
- Queue visibility and tracking.
- Mailchimp, SendGrid, Gmail, and Outlook support depending on use case.

**Why it matters:** Transactional communications triggered by dates and status changes fit Txlio well. Marketing-oriented bulk email is a later-stage CRM feature and should not be an early priority.

### 9. Integrations and platform extensibility

AFrame publicly claims:

- Email and calendar integration.
- ShowingTime and Supra imports for showing activity, agent details, and buyer feedback.
- Zapier support for contacts and transactions, including Cognito Forms and Jotform intake.
- Mailchimp and SendGrid support.
- An open API, webhooks, and triggers.

**Why it matters:** Calendar integration is immediately useful to Txlio. A general API/webhook layer becomes valuable after the transaction data model stabilizes. Showing integrations are listing-oriented and less central to Txlio’s initial contract-to-deadline wedge.

### 10. Onboarding, support, and packaging

AFrame publicly claims:

- Contact, transaction, and task import templates.
- Best-practice templates in new accounts.
- Demo videos, user guides, a video library, Q&A sessions, and real-estate-focused support.
- A full-access 30-day trial.
- Month-to-month pricing with no setup fees or long-term contract.
- Public pricing bands for standard users: $54 per user for 1–5 users, $34 for 6–10, $24 for 11–15, and $14 for 16+.
- Managed agents at no additional cost.

**Why it matters:** AFrame reduces adoption friction through templates and support, not only software. Txlio should package opinionated Colorado workflows and guided review as part of the product, rather than presenting a blank configuration surface.

## Competitive gap and opportunity matrix

| Capability | AFrame | Txlio now | Recommendation | Priority |
| --- | --- | --- | --- | --- |
| Contract PDF ingestion | Not emphasized publicly as a core differentiator | Working extraction pipeline with source/confidence metadata | Make this the primary wedge and deepen it | P0 |
| Persistent transaction records | Mature public claim | Not implemented | Build first; prerequisite for everything else | P0 |
| Durable document storage | Unlimited storage claim | Local upload directory | Add private object storage and document metadata | P0 |
| Transaction list/grid | Customizable operational grid | Empty-state placeholder | Build filters, saved views, columns, and inline status/date edits | P1 |
| Deadline/task execution | Action plans, assignment, tracking | Extracted dates only | Convert approved dates to tasks, reminders, assignees, and completion state | P1 |
| Calendar sync | Publicly supported | None | Start with ICS export, then Google/Microsoft two-way sync | P1 |
| Client-ready timeline | Portal plus selective visibility | Branded PDF export | Add secure branded web timeline and share controls | P1 |
| Workflow templates | Deep templates/action plans | Hard-coded output template only | Add transaction-type templates seeded from extracted contract data | P1 |
| Transactional email templates | Merge fields, task-linked templates, conditional content | None | Add deadline/status-triggered email templates after tasks exist | P2 |
| Team roles and ownership | Multi-user, role permissions, groups | Authentication only | Add organization tenancy, roles, ownership, and managed-agent access | P2 |
| Contacts/participants | Full CRM | Implicit data in contract only | Start with transaction participants, then promote to reusable contacts | P2 |
| Operational analytics | Extensive dashboards and reports | None | Add deadline risk, throughput, review accuracy, and close-cycle metrics | P2 |
| API/webhooks/Zapier | Public API, triggers, Zapier | None | Add outbound webhooks first; broader API after schema stabilizes | P2 |
| Bulk marketing email | Advanced batch email | None | Defer; not central to initial value proposition | P3 |
| ShowingTime/Supra | Direct imports | None | Defer until listing-management scope is intentional | P3 |
| Broad relationship CRM | Categories, ratings, touch dates, campaigns | None | Defer until transaction operations has product-market pull | P3 |
| Drag-and-drop analytics builder | Dozens of widgets | None | Defer; begin with opinionated operational dashboards | P3 |

## Recommended Txlio product direction

### Product position

A useful positioning direction is:

> **Txlio turns real-estate contracts into a live, accountable transaction plan.** Upload the contract once; Txlio extracts the deadlines, shows the source, flags uncertainty, assigns the work, updates stakeholders, and keeps the transaction on track.

That is more differentiated and credible for the current product than “another all-in-one real-estate CRM.” It also creates a path into the same valuable daily workflows AFrame serves.

### Design principles to preserve

1. **Document-first, not data-entry-first.** Populate the transaction from the contract before asking users to type fields.
2. **Evidence attached to automation.** Keep source page, snippet, confidence, and review state available for every extracted milestone.
3. **Human approval for material dates.** Do not silently trigger reminders or client messages from low-confidence extraction.
4. **Opinionated defaults before deep customization.** Ship Colorado transaction templates and useful views before building a generic workflow designer.
5. **Progressive collaboration.** Let a TC invite a managed agent or client without requiring every participant to become a full paid user.
6. **Operational outcomes over feature parity.** Prioritize fewer missed deadlines, faster file setup, less status-email work, and clearer client communication.

## Phased roadmap

### Phase 0: Durable foundation

**Goal:** Make a generated timeline a persistent, secure transaction.

- Add organizations/workspaces and memberships.
- Define transaction, document, milestone, participant, and audit-event records.
- Persist parsed results and user edits in Supabase.
- Store source PDFs and exports in private object storage rather than local disk.
- Enforce organization ownership and transaction-level authorization in every API route.
- Add transaction statuses such as intake, review required, active, under contract, closing, closed, and cancelled.
- Replace the timeline empty state with real transaction records.
- Preserve parser version, confidence, source page, source snippet, original value, and approved value.
- Validate OCR end to end, then align upload messaging with actual support.

**Success criteria:** A user can upload, leave, return, edit, and export a transaction without reprocessing or losing state; one user cannot access another organization’s records.

### Phase 1: Deadline operations

**Goal:** Turn extraction into day-to-day execution.

- Review queue for unresolved or low-confidence milestones.
- Milestone assignee, status, due time, reminder rules, notes, and completion state.
- Automatic task creation after milestone approval.
- Relative-date dependency resolution with business-day handling.
- Calendar-ready ICS export.
- Dashboard cards for upcoming deadlines, overdue work, review required, and closings.
- Operational transaction grid with search, status filters, configurable columns, saved views, and inline date/status edits.
- Deadline-change audit trail and notifications.

**Success criteria:** A transaction coordinator can run the week’s work from Txlio instead of treating it only as a PDF generator.

### Phase 2: Stakeholder experience and reusable workflows

**Goal:** Reduce repetitive setup and status communication.

- Branded, read-only transaction timeline portal.
- Invitation links and per-field visibility for agents, buyers, and sellers.
- Reusable transaction/action-plan templates.
- Role-based default task assignment.
- Email templates with transaction/contact merge fields.
- Triggered messages for approval, approaching deadline, missed deadline, status change, and closing.
- User-managed branding for portals and exported PDFs.
- Participants extracted or suggested from contract data, with review before saving.

**Success criteria:** New files can be configured from a template and clients can self-serve current dates/status without recurring manual updates.

### Phase 3: Teams, reporting, and integrations

**Goal:** Support transaction-coordinator businesses and small brokerages.

- Roles for owner/admin, coordinator, agent, reviewer, and portal participant.
- Transaction ownership, team assignment, and managed-agent seats.
- Google and Microsoft calendar/email integrations.
- Outbound webhooks for transaction and milestone events.
- Form intake through a documented API or Zapier-style connector.
- Reports for active pipeline, upcoming/late deadlines, coordinator workload, time-to-review, extraction corrections, closed/cancelled volume, and cycle time.
- Shareable production/value report for a TC’s agent clients.

**Success criteria:** A multi-user TC team can assign work, report outcomes, and connect Txlio to its existing communication stack.

### Phase 4: Selective expansion

Only pursue these after usage data demonstrates demand:

- Contact categories, relationship ratings, and touch reminders.
- Bulk marketing email and campaigns.
- Listing marketing activity and showing-feedback integrations.
- Highly customizable analytics widgets.
- Open write API and integration marketplace.
- Additional state forms and transaction types beyond Colorado CBS1.

## Feature concepts Txlio can improve beyond AFrame’s public positioning

### 1. Source-linked deadline review

For every milestone, show:

- Extracted title and date.
- Contract section/reference.
- Source page and highlighted snippet.
- Confidence score and reason for review.
- Original extracted value and user-approved value.
- Downstream reminders/tasks that will change if the date changes.

This converts AI extraction from a black box into an auditable workflow.

### 2. Deadline impact graph

When one approved date changes, calculate and preview affected relative deadlines, assigned tasks, calendar events, and scheduled communications before applying the update.

### 3. Transaction risk dashboard

Use operational signals rather than a generic widget builder initially:

- Deadlines due in 24/48/72 hours.
- Overdue milestones.
- Unreviewed low-confidence extraction.
- Missing assignees or participants.
- Conflicting or impossible dates.
- Transactions with no recent activity.
- Closing-readiness checklist.

### 4. Guided intake and validation

After upload, ask only for missing or uncertain data. Compare the document against a state/form-specific checklist and explain what Txlio could not verify.

### 5. One-click stakeholder packet

Generate a branded portal/PDF/email package containing the approved timeline, responsible contacts, next actions, and a controlled subset of documents. This builds directly on Txlio’s existing export strength.

## What not to copy yet

- **A full CRM:** It would dilute the contract-intelligence wedge and substantially increase scope.
- **A generic drag-and-drop dashboard builder:** Opinionated deadline and workload views will deliver value sooner.
- **Bulk marketing infrastructure:** Transactional messages are closer to Txlio’s core job than campaigns.
- **Listing-showing integrations:** These serve a broader listing-management product; validate that market direction first.
- **Unlimited storage as an early promise:** Establish retention policies, storage economics, and document-security controls before adopting competitor packaging.
- **Unlimited customization:** Too much flexibility before Txlio has proven workflows will increase implementation and onboarding complexity.

## Suggested first backlog

| Order | Epic | User outcome | Relative effort |
| --- | --- | --- | --- |
| 1 | Persistent transaction + private documents | Transactions survive across sessions and are securely isolated | Large |
| 2 | Review and approval workflow | Users can verify uncertain extraction before automation | Medium |
| 3 | Transaction list/grid | Users can find, filter, and manage active files | Medium |
| 4 | Milestones as tasks/reminders | Extracted dates become actionable work | Large |
| 5 | ICS calendar export | Approved deadlines reach the user’s calendar quickly | Small |
| 6 | Branded share portal | Agents and clients can see approved dates without email back-and-forth | Large |
| 7 | Transaction templates/action plans | Repetitive setup becomes consistent and reusable | Large |
| 8 | Organization roles and managed agents | TC teams can collaborate without paying for every agent as a full user | Large |
| 9 | Triggered email templates | Routine status and deadline communications are automated | Large |
| 10 | Operational reporting | Teams can demonstrate value and identify bottlenecks | Medium |

## Pricing implication

AFrame’s public model charges for full-access standard users while allowing managed agents at no additional cost. Txlio should consider a similar distinction between **operators** and **participants**, but should differentiate its commercial model around the document-intelligence wedge. Options worth validating include:

- Paid operator seats with free managed agents and portal participants.
- A base workspace subscription that includes a transaction volume allowance.
- Usage tiers based on processed documents only when OCR/AI costs materially vary.
- No per-transaction fee for ordinary transaction management after processing, to avoid discouraging adoption.

Pricing should be tested with transaction coordinators before implementation; competitor pricing is a reference point, not proof of willingness to pay for Txlio.

## Bottom line

AFrame demonstrates that customers value an integrated operating system for real-estate transactions, not merely a deadline report. Txlio should move toward that operating system in layers, beginning with the advantages already present in its codebase: automated contract intake, source-aware deadline extraction, human review, and client-friendly outputs.

The strategic target is not “AFrame with fewer features.” It is **a document-intelligent transaction workspace that requires less setup, exposes stronger evidence, and automates the work that follows an approved contract**.
