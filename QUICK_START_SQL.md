# 🚀 QUICK START - Add Jobs to Database

## Why Jobs Aren't Showing

The website is deployed and working perfectly, but **the jobs table is empty**. You need to run the SQL script in Supabase to populate jobs.

---

## Copy-Paste This Into Supabase SQL Editor

### Option 1: Run Both Migration Files

1. **Open Supabase Dashboard:** https://supabase.com/dashboard/project/ynedsbgiveycubmusjzf
2. **Go to SQL Editor** (left sidebar)
3. **Click "New Query"**
4. **Copy-paste the following files in order:**

**First:** `supabase/migrations/002_jobs_table.sql`
- This creates the jobs table structure
- Click **"Run"**

**Second:** `add-jobs-to-database.sql`  
- This adds 20 jobs including the LinkedIn Onsite Supervisor
- Click **"Run"**

### Option 2: Quick Test (Just Add One Job)

If you want to test quickly, just run this:

```sql
-- Quick test: Add the LinkedIn Onsite Supervisor job
INSERT INTO public.jobs (
    title, 
    description, 
    requirements, 
    location_city, 
    location_state, 
    location_zip, 
    job_type, 
    category, 
    salary_min, 
    salary_max, 
    salary_type, 
    is_active, 
    featured
)
VALUES
(
    'Onsite Supervisor',
    'The Onsite Supervisor will oversee the day-to-day operations of staffing and workforce management at client locations. Responsibilities include managing employee schedules, addressing staffing needs, resolving conflicts or issues, ensuring compliance with company policies and procedures, and fostering a collaborative work environment.',
    'Leadership and team management skills; Strong problem-solving and decision-making abilities; Excellent organizational and time-management skills; Proficient communication and interpersonal skills; Experience in staffing or workforce management (preferred); Bilingual (English-Spanish) preferred',
    'Piscataway',
    'NJ',
    '08854',
    'full-time',
    'Management',
    59306,
    76702,
    'annual',
    true,
    true
);
```

---

## ✅ Verification

After running the SQL:

1. **Check Supabase Table Editor:**
   - Go to "Table Editor" → "jobs"
   - You should see jobs listed

2. **Refresh Website:**
   - Visit: https://unique-staffing-professionals.netlify.app/#jobs
   - Jobs should now appear

3. **Test Features:**
   - Jobs auto-populate (no search needed)
   - Can filter by job title
   - Can filter by ZIP code
   - Featured jobs appear first
   - Click "Apply Now" scrolls to application form

---

## 🎯 What The SQL Does

The `add-jobs-to-database.sql` script adds **20 diverse jobs** including:

1. **Onsite Supervisor** (LinkedIn job) - Piscataway, NJ - $59,306-$76,702 ⭐ Featured
2. **Administrative Assistant** - Laurel, MD - $32k-$38k
3. **Forklift Operator** - Jessup, MD - $18-$22/hr ⭐ Featured
4. **Customer Service Rep** - Greenbelt, MD - $33k-$40k
5. **Production Worker** - Beltsville, MD - $16-$19/hr
6. **Medical Receptionist** - Silver Spring, MD - $36k-$42k
7. **Delivery Driver** - Capitol Heights, MD - $17-$21/hr ⭐ Featured
8. **IT Support Technician** - Rockville, MD - $45k-$55k
9. **Retail Manager** - Waldorf, MD - $42k-$52k
10. **Accounting Clerk** - Bethesda, MD - $38k-$45k
11. **Security Officer** - Alexandria, VA - $16-$20/hr
12. **Food Service Worker** - Gaithersburg, MD - $14-$17/hr
13. **HR Assistant** - Tysons, VA - $40k-$48k ⭐ Featured
14. **Maintenance Technician** - Landover, MD - $20-$26/hr
15. **Data Entry Specialist** - Remote, MD - $15-$18/hr
16. **Sales Representative** - Columbia, MD - $45k-$75k ⭐ Featured
17. **Assembly Technician** - Germantown, MD - $17-$21/hr
18. **Bookkeeper** - Annapolis, MD - $22-$28/hr
19. **Receptionist** - Arlington, VA - $32k-$38k
20. **Machine Operator** - Baltimore, MD - $18-$23/hr ⭐ Featured

---

## 🔍 Troubleshooting

### Jobs Still Not Showing?

1. **Check Browser Console:**
   - Press F12 → Console tab
   - Look for errors related to "jobs" or Supabase

2. **Verify RLS Policy:**
```sql
-- Check if public can read jobs
SELECT * FROM public.jobs WHERE is_active = true LIMIT 5;
```

3. **Check Supabase Connection:**
   - Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in Netlify

4. **Clear Cache:**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Or wait 2-3 minutes for CDN propagation

---

## 📞 Need Help?

Email: omorilla@uniquestaffingprofessionals.com

---

**⏱️ Estimated Time:** 5 minutes to run SQL and see jobs appear

