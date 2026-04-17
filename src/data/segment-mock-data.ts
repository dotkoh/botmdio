import { Segment } from "./segment-types";

export const mockSegments: Segment[] = [
  {
    id: "seg_001", org_id: "mediatrix", name: "Female patients over 40", description: "All female patients aged 40 and above",
    type: "dynamic",
    condition_groups: [
      { id: "grp_1", logic: "AND", conditions: [
        { id: "cond_1", property_key: "gender", operator: "equals", value: "Female" },
        { id: "cond_2", property_key: "age", operator: "greater_than", value: "40" },
      ]},
    ],
    contact_count: 18, created_by: "Dot Koh", updated_by: "Dot Koh", created_at: "2026-03-10T10:00:00Z", updated_at: "2026-04-14T08:00:00Z",
  },
  {
    id: "seg_002", org_id: "mediatrix", name: "Diabetes patients", description: "Patients with diabetes as a co-morbidity",
    type: "dynamic",
    condition_groups: [
      { id: "grp_2", logic: "AND", conditions: [
        { id: "cond_3", property_key: "co_morbidities", operator: "contains", value: "Diabetes" },
      ]},
    ],
    contact_count: 8, created_by: "Dot Koh", updated_by: "Dot Koh", created_at: "2026-03-15T14:00:00Z", updated_at: "2026-04-12T09:00:00Z",
  },
  {
    id: "seg_003", org_id: "mediatrix", name: "Maxicare insurance holders", description: "All patients with Maxicare insurance",
    type: "dynamic",
    condition_groups: [
      { id: "grp_3", logic: "AND", conditions: [
        { id: "cond_4", property_key: "insurance_provider", operator: "equals", value: "Maxicare" },
      ]},
    ],
    contact_count: 12, created_by: "Admin User", updated_by: "Admin User", created_at: "2026-03-20T09:00:00Z", updated_at: "2026-04-10T11:00:00Z",
  },
  {
    id: "seg_004", org_id: "mediatrix", name: "VIP patients - Q2 campaign", description: "Hand-picked VIP patients for Q2 marketing campaign",
    type: "static",
    contact_ids: ["c001", "c004", "c006", "c009", "c012", "c016", "c017", "c019", "c022", "c025", "c027", "c030", "c032", "c035", "c038", "c040", "c041", "c044", "c046", "c047", "c049", "c050", "c052", "c053", "c055"],
    contact_count: 25, created_by: "Dot Koh", updated_by: "Dot Koh", created_at: "2026-04-01T10:00:00Z", updated_at: "2026-04-01T10:00:00Z",
  },
  {
    id: "seg_005", org_id: "mediatrix", name: "Post-discharge follow-up group", description: "Patients discharged in April for follow-up survey",
    type: "static",
    contact_ids: ["c001", "c004", "c006", "c008", "c009", "c011", "c012", "c014", "c016", "c019", "c022", "c024", "c025", "c027"],
    contact_count: 14, created_by: "Admin User", updated_by: "Dot Koh", created_at: "2026-04-10T08:00:00Z", updated_at: "2026-04-14T07:00:00Z",
  },
  {
    id: "seg_006", org_id: "mediatrix", name: "Hypertension patients over 50", description: "Patients with hypertension aged 50+",
    type: "dynamic",
    condition_groups: [
      { id: "grp_4", logic: "AND", conditions: [
        { id: "cond_5", property_key: "co_morbidities", operator: "contains", value: "Hypertension" },
        { id: "cond_6", property_key: "age", operator: "greater_than", value: "50" },
      ]},
    ],
    contact_count: 11, created_by: "Dot Koh", updated_by: "Dot Koh", created_at: "2026-04-05T16:00:00Z", updated_at: "2026-04-14T08:00:00Z",
  },
];
