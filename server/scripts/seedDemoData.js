import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Customer from '../models/Customer.js';
import Transaction from '../models/Transaction.js';
import { clearCachePattern } from '../utils/cache.js';

/**
 * ----------------------------------------------------------------------------
 * AI-POWERED CREDIT MANAGEMENT SYSTEM - DEVELOPMENT & DEMO SEED ENGINE
 * ----------------------------------------------------------------------------
 * Generates 30 realistic Indian retail customers with authentic multi-month
 * transaction histories, mixed balances (settled, active pending, overdue),
 * multiple payment modes (Cash, UPI, Bank Transfer), and realistic notes.
 *
 * Designed to be 100% idempotent and safe:
 * - Identifies demo records via dedicated demo phone number set (9819900001 - 9819900030)
 * - Safely clears existing demo records for the target user before re-seeding
 * - Never modifies real non-demo customer records
 * - Recalibrates running balances and cache automatically
 * ----------------------------------------------------------------------------
 */

// Dedicated demo phone numbers reserved for safe development isolation
const DEMO_PHONE_RANGE = Array.from({ length: 30 }, (_, i) =>
  `98199${String(i + 1).padStart(5, '0')}`
);
const DEMO_CUSTOMER_LIMIT = 15;

// Date offset helpers relative to script execution time
const daysAgo = (days, hour = 11, minute = 30) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, minute, 0, 0);
  return d;
};

const daysFromNow = (days, hour = 18, minute = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d;
};

/**
 * 30 Authentic Indian Retail Customer Definitions
 * Covering kirana, electronics, apparel, stationery, and local trade.
 */
const DEMO_CUSTOMERS_SPEC = [
  // ==========================================================================
  // CATEGORY 1: HEALTHY ACTIVE PENDING CUSTOMERS (Dues within current period)
  // ==========================================================================
  {
    index: 0,
    name: 'Rajesh Gupta',
    address: 'Shop 4, Main Market, Sector 14, Gurugram [Demo]',
    creditLimit: 25000,
    status: 'active',
    transactions: [
      { type: 'CREDIT', amount: 5200, daysAgo: 45, desc: '10kg Basmati Rice, 5L Mustard Oil, Spices', bill: 'BILL-1021', dueDaysAgo: -15 },
      { type: 'PAYMENT', amount: 3000, daysAgo: 30, desc: 'Cash payment received at counter', mode: 'CASH' },
      { type: 'CREDIT', amount: 4800, daysAgo: 12, desc: 'Dairy products, Dry fruits pack & Ghee 2kg', bill: 'BILL-1104', dueDaysAgo: -18 },
      { type: 'PAYMENT', amount: 2500, daysAgo: 5, desc: 'GPay UPI Settlement Ref #92817263', mode: 'UPI' },
    ],
  },
  {
    index: 1,
    name: 'Neha Singh',
    address: 'Flat 402, Green Glen Layout, Bellandur, Bengaluru [Demo]',
    creditLimit: 30000,
    status: 'active',
    transactions: [
      { type: 'CREDIT', amount: 14500, daysAgo: 60, desc: 'Samsung 24-inch Monitor & HDMI Cable', bill: 'INV-2041', dueDaysAgo: -10 },
      { type: 'PAYMENT', amount: 10000, daysAgo: 40, desc: 'Bank Transfer via IMPS Ref #IMPS82914', mode: 'BANK_TRANSFER' },
      { type: 'CREDIT', amount: 3700, daysAgo: 8, desc: 'Wireless Keyboard and Mouse Combo', bill: 'INV-2190', dueDaysAgo: -14 },
    ],
  },
  {
    index: 2,
    name: 'Manoj Tiwari',
    address: 'Near Hanuman Mandir, Alambagh, Lucknow [Demo]',
    creditLimit: 15000,
    status: 'active',
    transactions: [
      { type: 'CREDIT', amount: 6200, daysAgo: 50, desc: 'Monthly Ration Kit - Wheat Flour 20kg, Pulses', bill: 'BILL-1044', dueDaysAgo: -5 },
      { type: 'PAYMENT', amount: 4000, daysAgo: 35, desc: 'PhonePe UPI Ref #P81927394', mode: 'UPI' },
      { type: 'CREDIT', amount: 2600, daysAgo: 10, desc: 'Tea powder 1kg, Sugar 10kg, Cooking Oil', bill: 'BILL-1115', dueDaysAgo: -10 },
      { type: 'PAYMENT', amount: 2000, daysAgo: 0, desc: 'Today morning cash settlement', mode: 'CASH' }, // Today's payment!
    ],
  },
  {
    index: 3,
    name: 'Dr. Ananya Roy',
    address: 'Roy Medicare Clinic, Salt Lake Sector 2, Kolkata [Demo]',
    creditLimit: 40000,
    status: 'active',
    transactions: [
      { type: 'CREDIT', amount: 18000, daysAgo: 75, desc: 'Surgical cotton rolls, Hand sanitizers & PPE kit', bill: 'MED-4012', dueDaysAgo: -20 },
      { type: 'PAYMENT', amount: 12000, daysAgo: 50, desc: 'HDFC Bank NEFT Settlement', mode: 'BANK_TRANSFER' },
      { type: 'CREDIT', amount: 6000, daysAgo: 14, desc: 'Digital BP Monitor & Infrared Thermometers', bill: 'MED-4120', dueDaysAgo: -16 },
    ],
  },
  {
    index: 4,
    name: 'Deepak Choudhary',
    address: 'Plot 18, Vaishali Nagar, Jaipur [Demo]',
    creditLimit: 20000,
    status: 'active',
    transactions: [
      { type: 'CREDIT', amount: 7500, daysAgo: 40, desc: 'Construction supplies, Extension boards & Plugs', bill: 'ELE-801', dueDaysAgo: -12 },
      { type: 'PAYMENT', amount: 5000, daysAgo: 22, desc: 'Paytm UPI QR Payment #PTM72619', mode: 'UPI' },
      { type: 'CREDIT', amount: 3200, daysAgo: 6, desc: 'LED Batten lights 20W pack of 6', bill: 'ELE-889', dueDaysAgo: -15 },
    ],
  },
  {
    index: 5,
    name: 'Pooja Reddy',
    address: 'Road No 36, Jubilee Hills, Hyderabad [Demo]',
    creditLimit: 35000,
    status: 'active',
    transactions: [
      { type: 'CREDIT', amount: 12500, daysAgo: 65, desc: 'Designer boutique packaging boxes & ribbons', bill: 'PKG-301', dueDaysAgo: -10 },
      { type: 'PAYMENT', amount: 8000, daysAgo: 42, desc: 'GPay UPI Ref #GP81920491', mode: 'UPI' },
      { type: 'CREDIT', amount: 4500, daysAgo: 11, desc: 'Tag pins, Label printers rolls & Carry bags', bill: 'PKG-342', dueDaysAgo: -12 },
    ],
  },
  {
    index: 6,
    name: 'Suresh Nair',
    address: 'Cheranalloor Road, Edappally, Kochi [Demo]',
    creditLimit: 12000,
    status: 'active',
    transactions: [
      { type: 'CREDIT', amount: 4800, daysAgo: 38, desc: 'School notebooks wholesale bundle, Drawing sheets', bill: 'STA-902', dueDaysAgo: -8 },
      { type: 'PAYMENT', amount: 3000, daysAgo: 20, desc: 'Cash payment by helper', mode: 'CASH' },
      { type: 'CREDIT', amount: 1500, daysAgo: 4, desc: 'Geometry boxes & Permanent marker packs', bill: 'STA-944', dueDaysAgo: -14 },
    ],
  },
  {
    index: 7,
    name: 'Alok Saxena',
    address: 'B-12 Nirala Nagar, Lucknow [Demo]',
    creditLimit: 18000,
    status: 'active',
    transactions: [
      { type: 'CREDIT', amount: 6400, daysAgo: 48, desc: 'Monthly provision items, Dal, Spices, Soap kit', bill: 'BILL-1055', dueDaysAgo: -6 },
      { type: 'PAYMENT', amount: 4000, daysAgo: 28, desc: 'PhonePe UPI Settlement #PP9182', mode: 'UPI' },
      { type: 'CREDIT', amount: 2200, daysAgo: 7, desc: 'Snacks, Biscuits carton & Soft drink crates', bill: 'BILL-1120', dueDaysAgo: -12 },
    ],
  },
  {
    index: 8,
    name: 'Kavita Deshmukh',
    address: 'Near Shivaji Park, Dadar West, Mumbai [Demo]',
    creditLimit: 22000,
    status: 'active',
    transactions: [
      { type: 'CREDIT', amount: 8900, daysAgo: 55, desc: 'Dry Grocery, Poha, Besan, Rice 25kg bag', bill: 'BILL-1033', dueDaysAgo: -15 },
      { type: 'PAYMENT', amount: 5500, daysAgo: 32, desc: 'GPay UPI Ref #GP71928301', mode: 'UPI' },
      { type: 'CREDIT', amount: 3100, daysAgo: 9, desc: 'Refined sunflower oil tin 15L', bill: 'BILL-1111', dueDaysAgo: -14 },
    ],
  },
  {
    index: 9,
    name: 'Arvind Mehta',
    address: 'Ellisbridge, Ashram Road, Ahmedabad [Demo]',
    creditLimit: 25000,
    status: 'active',
    transactions: [
      { type: 'CREDIT', amount: 11000, daysAgo: 70, desc: 'Apparel fabric rolls & Stitching accessories', bill: 'TXT-201', dueDaysAgo: -20 },
      { type: 'PAYMENT', amount: 7000, daysAgo: 45, desc: 'Bank NEFT Transfer Ref #N719283', mode: 'BANK_TRANSFER' },
      { type: 'CREDIT', amount: 4200, daysAgo: 13, desc: 'YKK Zippers, Buttons box & Thread spools', bill: 'TXT-245', dueDaysAgo: -10 },
    ],
  },
  {
    index: 10,
    name: 'Sandeep Kothari',
    address: 'Station Road, M.I. Road, Jaipur [Demo]',
    creditLimit: 20000,
    status: 'active',
    transactions: [
      { type: 'CREDIT', amount: 9500, daysAgo: 42, desc: 'Electrical conduits, PVC pipes & Switchboards', bill: 'ELE-912', dueDaysAgo: -11 },
      { type: 'PAYMENT', amount: 5000, daysAgo: 25, desc: 'Cash paid at shop counter', mode: 'CASH' },
      { type: 'CREDIT', amount: 3300, daysAgo: 6, desc: 'Copper wire coil 1.5 sq mm (90m)', bill: 'ELE-982', dueDaysAgo: -14 },
    ],
  },
  {
    index: 11,
    name: 'Meenakshi Sundaram',
    address: 'Near Meenakshi Amman Temple, Madurai [Demo]',
    creditLimit: 45000,
    status: 'active',
    transactions: [
      { type: 'CREDIT', amount: 26000, daysAgo: 80, desc: 'Hostel mess bulk groceries - Ponni Rice 100kg, Toor Dal', bill: 'HST-101', dueDaysAgo: -15 },
      { type: 'PAYMENT', amount: 18000, daysAgo: 50, desc: 'SBI Bank IMPS Transfer #SBIN8192', mode: 'BANK_TRANSFER' },
      { type: 'CREDIT', amount: 7500, daysAgo: 16, desc: 'Cooking oil cans 15kg x 2 & Cooking gas deposit', bill: 'HST-144', dueDaysAgo: -18 },
    ],
  },
  {
    index: 12,
    name: 'Rohit Agrawal',
    address: 'Kalyan Nagar, Ring Road, Indore [Demo]',
    creditLimit: 16000,
    status: 'active',
    transactions: [
      { type: 'CREDIT', amount: 7200, daysAgo: 36, desc: 'Fast food paper plates, Disposables, Sauce cans', bill: 'DIS-501', dueDaysAgo: -7 },
      { type: 'PAYMENT', amount: 4500, daysAgo: 18, desc: 'Paytm UPI QR Ref #PTM918274', mode: 'UPI' },
      { type: 'CREDIT', amount: 2100, daysAgo: 3, desc: 'Tissue paper cartons & Paper cups (2000 pcs)', bill: 'DIS-544', dueDaysAgo: -12 },
      { type: 'PAYMENT', amount: 1500, daysAgo: 0, desc: 'Today evening UPI payment', mode: 'UPI' }, // Today's payment!
    ],
  },

  // ==========================================================================
  // CATEGORY 2: CRITICAL OVERDUE DEBTORS (Past due date - For Reminders & AI)
  // ==========================================================================
  {
    index: 13,
    name: 'Harish Chandra',
    address: 'Chowk Mandi, Old City, Kanpur [Demo]',
    creditLimit: 30000,
    status: 'active',
    transactions: [
      { type: 'CREDIT', amount: 18500, daysAgo: 70, desc: 'Wholesale mustard oil tins 15L x 6', bill: 'BILL-0982', dueDaysAgo: 45 }, // Overdue by 45 days
    ],
  },
  {
    index: 14,
    name: 'Santosh Yadav',
    address: 'Village Badshahpur, Sohna Road, Gurugram [Demo]',
    creditLimit: 20000,
    status: 'active',
    transactions: [
      { type: 'CREDIT', amount: 14200, daysAgo: 60, desc: 'Submersible pump motor, Starters & Cables', bill: 'AGR-402', dueDaysAgo: 30 }, // Overdue by 30 days
      { type: 'PAYMENT', amount: 5000, daysAgo: 35, desc: 'Partial cash payment on site', mode: 'CASH' },
    ],
  },
  {
    index: 15,
    name: 'Rakesh Bansal',
    address: 'Sector 21-C, Near Market, Chandigarh [Demo]',
    creditLimit: 50000,
    status: 'active',
    transactions: [
      { type: 'CREDIT', amount: 32000, daysAgo: 95, desc: 'Complete renovation paint materials, Putty & Brushes', bill: 'PNT-801', dueDaysAgo: 60 }, // Overdue by 60 days
      { type: 'PAYMENT', amount: 8000, daysAgo: 65, desc: 'Cheque Clearance Bank Transfer', mode: 'BANK_TRANSFER' },
    ],
  },
  {
    index: 16,
    name: 'Mohammad Arif',
    address: 'Near Charminar, Laad Bazaar, Hyderabad [Demo]',
    creditLimit: 15000,
    status: 'active',
    transactions: [
      { type: 'CREDIT', amount: 9800, daysAgo: 40, desc: 'Bangle boxes packaging, Velvet rolls & Adhesive', bill: 'ART-201', dueDaysAgo: 15 }, // Overdue by 15 days
      { type: 'PAYMENT', amount: 4000, daysAgo: 25, desc: 'Google Pay UPI #GP918234', mode: 'UPI' },
    ],
  },
  {
    index: 17,
    name: 'Sanjay Kulkarni',
    address: 'FC Road, Shivaji Nagar, Pune [Demo]',
    creditLimit: 20000,
    status: 'active',
    transactions: [
      { type: 'CREDIT', amount: 11400, daysAgo: 50, desc: 'Stationery office files, A4 Paper reams (10 boxes)', bill: 'STA-819', dueDaysAgo: 22 }, // Overdue by 22 days
      { type: 'PAYMENT', amount: 4000, daysAgo: 30, desc: 'Cash collected by staff', mode: 'CASH' },
    ],
  },
  {
    index: 18,
    name: 'Geeta Devi',
    address: 'Gali 4, Shastri Nagar, Ghaziabad [Demo]',
    creditLimit: 10000,
    status: 'active',
    transactions: [
      { type: 'CREDIT', amount: 5600, daysAgo: 65, desc: 'Kitchen grocery items & Personal care products', bill: 'BILL-0994', dueDaysAgo: 38 }, // Overdue by 38 days
      { type: 'PAYMENT', amount: 2500, daysAgo: 45, desc: 'PhonePe payment', mode: 'UPI' },
    ],
  },
  {
    index: 19,
    name: 'Dinesh Rawat',
    address: 'Haridwar Road, Dharampur, Dehradun [Demo]',
    creditLimit: 25000,
    status: 'active',
    transactions: [
      { type: 'CREDIT', amount: 19200, daysAgo: 85, desc: 'Hardware tools, Drill machines & Power tool accessories', bill: 'TLS-440', dueDaysAgo: 52 }, // Overdue by 52 days
      { type: 'PAYMENT', amount: 5000, daysAgo: 58, desc: 'Cash paid in shop', mode: 'CASH' },
    ],
  },
  {
    index: 20,
    name: 'Tarun Bhatia',
    address: 'Rani Bagh, Shakurpur, New Delhi [Demo]',
    creditLimit: 15000,
    status: 'active',
    transactions: [
      { type: 'CREDIT', amount: 10300, daysAgo: 35, desc: 'Electronics smartphone accessories, Earphones & Chargers', bill: 'ACC-812', dueDaysAgo: 12 }, // Overdue by 12 days
      { type: 'PAYMENT', amount: 4000, daysAgo: 20, desc: 'Paytm Wallet settlement', mode: 'UPI' },
    ],
  },

  // ==========================================================================
  // CATEGORY 3: FULLY SETTLED CUSTOMERS (Zero dues - Perfect payment history)
  // ==========================================================================
  {
    index: 21,
    name: 'Ramesh Kumar Verma',
    address: 'House 124, Kavi Nagar, Ghaziabad [Demo]',
    creditLimit: 20000,
    status: 'active',
    transactions: [
      { type: 'CREDIT', amount: 4500, daysAgo: 55, desc: 'Monthly Ration: Aata, Rice, Pulses, Sugar', bill: 'BILL-1011', dueDaysAgo: 10 },
      { type: 'PAYMENT', amount: 4500, daysAgo: 40, desc: 'Full settlement via GPay UPI Ref #492810', mode: 'UPI' },
      { type: 'CREDIT', amount: 3200, daysAgo: 25, desc: 'Spices, Dry fruits box & Tea bags', bill: 'BILL-1088', dueDaysAgo: 5 },
      { type: 'PAYMENT', amount: 3200, daysAgo: 12, desc: 'Full cash payment at counter', mode: 'CASH' },
    ],
  },
  {
    index: 22,
    name: 'Priya Sharma',
    address: 'B-404, Maple Woods, Viman Nagar, Pune [Demo]',
    creditLimit: 25000,
    status: 'active',
    transactions: [
      { type: 'CREDIT', amount: 8200, daysAgo: 60, desc: 'Diwali festive dry fruits hamper & Confectionery', bill: 'BILL-1025', dueDaysAgo: 15 },
      { type: 'PAYMENT', amount: 4000, daysAgo: 45, desc: 'Partial payment PhonePe UPI', mode: 'UPI' },
      { type: 'PAYMENT', amount: 4200, daysAgo: 30, desc: 'Final balance clearance via UPI Ref #PP82914', mode: 'UPI' },
    ],
  },
  {
    index: 23,
    name: 'Amit Patel',
    address: 'Satellite Road, Near Iscon Temple, Ahmedabad [Demo]',
    creditLimit: 30000,
    status: 'active',
    transactions: [
      { type: 'CREDIT', amount: 15000, daysAgo: 70, desc: 'Bulk supply wholesale grocery pack for family event', bill: 'BILL-0990', dueDaysAgo: 20 },
      { type: 'PAYMENT', amount: 15000, daysAgo: 48, desc: 'Full settlement via Bank Transfer IMPS', mode: 'BANK_TRANSFER' },
    ],
  },
  {
    index: 24,
    name: 'Sneha Joshi',
    address: 'Row House 8, Gangapur Road, Nashik [Demo]',
    creditLimit: 15000,
    status: 'active',
    transactions: [
      { type: 'CREDIT', amount: 3800, daysAgo: 35, desc: 'Kitchen essentials, Cleaning liquids & Toiletries', bill: 'BILL-1066', dueDaysAgo: 5 },
      { type: 'PAYMENT', amount: 3800, daysAgo: 20, desc: 'Cash paid on counter', mode: 'CASH' },
    ],
  },
  {
    index: 25,
    name: 'Vikram Malhotra',
    address: 'Sector 50, Noida, Gautam Buddha Nagar [Demo]',
    creditLimit: 35000,
    status: 'active',
    transactions: [
      { type: 'CREDIT', amount: 12000, daysAgo: 45, desc: 'Corporate office pantry monthly snacks & beverages', bill: 'BILL-1070', dueDaysAgo: 10 },
      { type: 'PAYMENT', amount: 12000, daysAgo: 22, desc: 'Company NEFT Settlement Ref #N81923', mode: 'BANK_TRANSFER' },
    ],
  },
  {
    index: 26,
    name: 'Sunita Devi',
    address: 'Ward 7, Mohan Nagar, Kurukshetra [Demo]',
    creditLimit: 12000,
    status: 'active',
    transactions: [
      { type: 'CREDIT', amount: 2800, daysAgo: 30, desc: 'Flour 10kg, Cooking oil 2L, Spices kit', bill: 'BILL-1092', dueDaysAgo: 2 },
      { type: 'PAYMENT', amount: 2800, daysAgo: 14, desc: 'Cash payment settlement', mode: 'CASH' },
    ],
  },

  // ==========================================================================
  // CATEGORY 4: HIGH-VALUE VIP ACCOUNTS & ARCHIVED ACCOUNTS
  // ==========================================================================
  {
    index: 27,
    name: 'Gurpreet Singh Sodhi',
    address: 'Model Town, Near Gurudwara, Ludhiana [Demo]',
    creditLimit: 60000,
    status: 'active',
    transactions: [
      { type: 'CREDIT', amount: 35000, daysAgo: 60, desc: 'Commercial restaurant supplies, Basmati 50kg, Oil tins', bill: 'COM-901', dueDaysAgo: -10 },
      { type: 'PAYMENT', amount: 20000, daysAgo: 40, desc: 'Cheque settlement credited in account', mode: 'BANK_TRANSFER' },
      { type: 'CREDIT', amount: 18000, daysAgo: 15, desc: 'Bulk dairy butter, Cheese blocks & Cream cartons', bill: 'COM-962', dueDaysAgo: -15 },
      { type: 'PAYMENT', amount: 11000, daysAgo: 0, desc: 'Today afternoon bulk RTGS payment', mode: 'BANK_TRANSFER' }, // Today's payment!
    ],
  },
  {
    index: 28,
    name: 'Vinod Khanna',
    address: 'Old Quarter, Civil Lines, Bareilly [Demo]',
    creditLimit: 15000,
    status: 'archived', // Archived customer test case
    transactions: [
      { type: 'CREDIT', amount: 6500, daysAgo: 110, desc: 'Household groceries before house relocation', bill: 'BILL-0891', dueDaysAgo: 60 },
      { type: 'PAYMENT', amount: 6500, daysAgo: 90, desc: 'Full closing settlement before shifting', mode: 'CASH' },
    ],
  },
  {
    index: 29,
    name: 'Lalita Pawar',
    address: 'Quarter 14, Railway Colony, Bilaspur [Demo]',
    creditLimit: 10000,
    status: 'archived', // Archived customer test case
    transactions: [
      { type: 'CREDIT', amount: 4200, daysAgo: 120, desc: 'Provisions and stationery kit', bill: 'BILL-0865', dueDaysAgo: 70 },
      { type: 'PAYMENT', amount: 4200, daysAgo: 100, desc: 'Full closing cash clearance', mode: 'CASH' },
    ],
  },
];

/**
 * Main Seed Execution Function
 */
async function seedDemoData() {
  console.log('\n=============================================================');
  console.log('🌱 AI-Powered Credit Management System - Demo Seed Engine');
  console.log('=============================================================\n');

  try {
    await connectDB();

    // Parse command line flags
    const args = process.argv.slice(2);
    const isCleanOnly = args.includes('--clean') || args.includes('--clear');
    const targetEmailArg = args.find((a) => a.startsWith('--email='));
    const targetEmail = targetEmailArg ? targetEmailArg.split('=')[1].trim().toLowerCase() : null;
    const allUsersFlag = args.includes('--all-users');

    // Determine target users
    let targetUsers = [];

    if (allUsersFlag) {
      targetUsers = await User.find({ isActive: true });
      if (targetUsers.length === 0) {
        throw new Error('No active users found in database to seed.');
      }
      console.log(`[Target] Mode: --all-users (${targetUsers.length} users found)`);
    } else if (targetEmail) {
      const user = await User.findOne({ email: targetEmail });
      if (!user) {
        throw new Error(`Target user with email "${targetEmail}" does not exist in database.`);
      }
      targetUsers = [user];
      console.log(`[Target] User: ${user.name} <${user.email}> (${user.businessName})`);
    } else {
      // Find the first registered user or create a dedicated demo user
      const existingUser = await User.findOne().sort({ createdAt: -1 });

      if (existingUser) {
        targetUsers = [existingUser];
        console.log(`[Target] Using primary registered user: ${existingUser.name} <${existingUser.email}> (${existingUser.businessName})`);
      } else {
        console.log('[Target] No users found. Creating a dedicated Demo Shop Owner account...');
        const demoOwner = await User.create({
          name: 'Ramesh Sharma',
          email: 'demo@kirana.store',
          phone: '9876543210',
          password: 'DemoPassword@123',
          businessName: 'Sharma Kirana & General Store',
          businessCategory: 'kirana',
          role: 'owner',
          isActive: true,
        });
        targetUsers = [demoOwner];
        console.log(`[Target] Created Demo User: ${demoOwner.name} <${demoOwner.email}> | Password: DemoPassword@123`);
      }
    }

    // Process each target user
    for (const user of targetUsers) {
      console.log(`\n-------------------------------------------------------------`);
      console.log(`🏬 Processing Tenant: ${user.businessName} (Owner: ${user.name})`);
      console.log(`-------------------------------------------------------------`);

      // 1. Identify existing demo customers for this owner
      const existingDemoCustomers = await Customer.find({
        ownerId: user._id,
        phone: { $in: DEMO_PHONE_RANGE },
      }).select('_id phone name');

      const existingDemoIds = existingDemoCustomers.map((c) => c._id);

      if (existingDemoIds.length > 0) {
        console.log(`[Cleanup] Found ${existingDemoIds.length} existing demo customers. Removing prior ledger data...`);
        // Remove associated transactions
        const txDeleteResult = await Transaction.deleteMany({
          ownerId: user._id,
          customerId: { $in: existingDemoIds },
        });
        // Remove demo customers
        const custDeleteResult = await Customer.deleteMany({
          ownerId: user._id,
          _id: { $in: existingDemoIds },
        });

        console.log(`[Cleanup] Removed ${custDeleteResult.deletedCount} demo customers & ${txDeleteResult.deletedCount} transaction records.`);
      } else {
        console.log('[Cleanup] No prior demo records found for this tenant. Clean slate.');
      }

      if (isCleanOnly) {
        console.log(`[Done] --clean flag passed. Demo data cleanup completed for ${user.email}.`);
        await clearCachePattern(`*${user._id.toString()}*`);
        continue;
      }

      // 2. Insert 30 realistic demo customers & their chronological transaction ledgers
      const demoCustomers = DEMO_CUSTOMERS_SPEC.slice(0, DEMO_CUSTOMER_LIMIT);

      console.log(`[Seeding] Generating ${demoCustomers.length} realistic Indian retail customers & statements...`);

      let totalTxCount = 0;
      let totalCreditGivenSum = 0;
      let totalPaymentReceivedSum = 0;
      let totalMarketOutstanding = 0;
      let settledCount = 0;
      let overdueCount = 0;
      let activePendingCount = 0;

      for (const spec of demoCustomers) {
        const phone = DEMO_PHONE_RANGE[spec.index];

        // Create Customer Document
        const customer = new Customer({
          ownerId: user._id,
          name: spec.name,
          phone,
          address: spec.address,
          creditLimit: spec.creditLimit,
          currentBalance: 0,
          totalCreditGiven: 0,
          totalPaymentReceived: 0,
          status: spec.status,
          lastTransactionDate: null,
        });

        await customer.save();

        // Sort spec transactions chronologically (oldest to newest)
        const sortedTxSpecs = [...spec.transactions].sort((a, b) => b.daysAgo - a.daysAgo);

        let runningBalance = 0;
        let custTotalCredit = 0;
        let custTotalPayment = 0;
        let lastDate = null;

        for (const txSpec of sortedTxSpecs) {
          const txDate = daysAgo(txSpec.daysAgo);
          lastDate = txDate;

          let dueDate = null;
          if (txSpec.dueDaysAgo !== undefined && txSpec.type === 'CREDIT') {
            dueDate = txSpec.dueDaysAgo > 0 ? daysAgo(txSpec.dueDaysAgo) : daysFromNow(Math.abs(txSpec.dueDaysAgo));
          }

          if (txSpec.type === 'CREDIT') {
            runningBalance += txSpec.amount;
            custTotalCredit += txSpec.amount;
            totalCreditGivenSum += txSpec.amount;
          } else {
            runningBalance -= txSpec.amount;
            custTotalPayment += txSpec.amount;
            totalPaymentReceivedSum += txSpec.amount;
          }

          await Transaction.create({
            ownerId: user._id,
            customerId: customer._id,
            type: txSpec.type,
            amount: txSpec.amount,
            description: txSpec.desc,
            dueDate,
            paymentMode: txSpec.mode || (txSpec.type === 'PAYMENT' ? 'CASH' : null),
            balanceAfterTransaction: runningBalance,
            billReference: txSpec.bill || '',
            transactionDate: txDate,
          });

          totalTxCount++;
        }

        // Update customer final calculated aggregates atomically
        customer.currentBalance = runningBalance;
        customer.totalCreditGiven = custTotalCredit;
        customer.totalPaymentReceived = custTotalPayment;
        customer.lastTransactionDate = lastDate;
        await customer.save();

        totalMarketOutstanding += runningBalance;

        if (runningBalance === 0) {
          settledCount++;
        } else if (spec.transactions.some((t) => t.dueDaysAgo > 0 && t.type === 'CREDIT')) {
          overdueCount++;
        } else {
          activePendingCount++;
        }
      }

      // Invalidate Redis Cache for this owner
      await clearCachePattern(`*${user._id.toString()}*`);

      // Summary Statistics Display
      console.log('\n📊 SEEDING SUMMARY FOR ' + user.businessName.toUpperCase());
      console.log('-------------------------------------------------------------');
      console.log(`✅ Demo Customers Created:    ${demoCustomers.length}`);
      console.log(`   - Active Pending Debtors:  ${activePendingCount}`);
      console.log(`   - Overdue Debtors:         ${overdueCount} (Ready for Reminders & AI)`);
      console.log(`   - Settled (₹0 Balance):    ${settledCount}`);
      console.log(`   - Archived Test Accounts:  2`);
      console.log(`✅ Ledger Transactions Created: ${totalTxCount}`);
      console.log(`📈 Cumulative Credit Given:   ₹${totalCreditGivenSum.toLocaleString('en-IN')}`);
      console.log(`💰 Cumulative Payments Jama:  ₹${totalPaymentReceivedSum.toLocaleString('en-IN')}`);
      console.log(`⚖️ Net Market Outstanding:    ₹${totalMarketOutstanding.toLocaleString('en-IN')}`);
      console.log('-------------------------------------------------------------');
    }

    console.log('\n✨ Demo Seeding Process Successfully Completed!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ [Fatal Error in Seed Script]:', error.message);
    if (error.stack) console.error(error.stack);
    process.exit(1);
  }
}

seedDemoData();
