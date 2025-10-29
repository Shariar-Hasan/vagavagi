# 🧮 ভাগাভাগি (Vagavagi)

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4+-38B2AC?style=for-the-badge&logo=tailwind-css)

**A modern, intuitive Bengali-language expense splitting application**

[Live Demo](https://vagavagi.vercel.app) • [Report Bug](https://github.com/Shariar-Hasan/vagavagi/issues) • [Request Feature](https://github.com/Shariar-Hasan/vagavagi/issues)

</div>

---

## 🌟 About

**ভাগাভাগি (Vagavagi)** is a single-page Next.js application designed to make splitting shared expenses effortless. Whether you're dining out with friends, planning a trip, or managing household expenses with roommates, this app calculates exactly who owes what and provides clear settlement instructions.

### Why Vagavagi?

- ✅ **No Sign-up Required** - Start using immediately
- ✅ **100% Free** - No hidden costs
- ✅ **Privacy First** - All data stays in your browser
- ✅ **Bengali Language** - Full Bengali interface for ease of use
- ✅ **Mobile Friendly** - Works perfectly on all devices
- ✅ **Dark Mode** - Beautiful dark theme for night-time use

---

## ✨ Features

### 🛍️ **Item Management**
- Add unlimited items with name, unit price, and quantity
- Edit or delete items anytime
- Real-time total calculation
- Input validation to prevent errors

### 👥 **Participant Tracking**
- Add multiple participants with their paid amounts
- Track individual consumption for each item
- Smart validation prevents over-allocation
- Easy edit with auto-scroll functionality

### 🧮 **Smart Calculations**
- Automatic balance calculation for each participant
- Optimized settlement algorithm minimizes transactions
- Clear "who pays whom" instructions
- Color-coded status indicators (green for receiving, red for paying)

### 📄 **PDF Export**
- Professional PDF reports with complete details
- Includes all items, participants, and settlements
- Properly formatted tables with aligned data
- Ready to share or print

### 💾 **Data Persistence**
- Automatic save to browser's LocalStorage
- Data survives page refreshes
- One-click clear all data option

### 🎨 **Modern UI/UX**
- Glassmorphism design with backdrop blur effects
- Animated gradient backgrounds
- Smooth transitions and hover effects
- Responsive grid layouts for all screen sizes
- Cookie-based theme persistence (faster loading)

### 🌙 **Enhanced Dark Mode**
- Rich, deep color palette
- Excellent contrast for readability
- Glowing animated backgrounds
- Custom scrollbar styling

---

## 📸 Screenshots

### Light Mode

![light mode](/public/light-mode.png)


### Dark Mode

![dark mode](/public/dark-mode.png)


---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18.0 or higher
- **npm** (comes with Node.js) or **yarn** or **pnpm**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shariar-Hasan/vagavagi.git
   cd vagavagi
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the app in action!

### Building for Production

```bash
# Build the application
npm run build

# Start the production server
npm start
```

The optimized production build will be created in the `.next` folder.

---

## 📱 How to Use

### Step 1: Add Items 🛍️

1. Enter the item name (e.g., "চা", "বিস্কুট", "পেট্রোল")
2. Enter the unit price in Taka (৳)
3. Enter the total quantity available
4. Click **"+ যোগ করুন"** to add
5. Items appear in a table where you can edit or delete them

**Example:**
- Item: চা (Tea)
- Unit Price: ৳15
- Quantity: 10 cups

### Step 2: Add Participants 👥

1. Enter participant's name
2. Enter the amount they paid (৳)
3. For each item, specify how many units they consumed
4. Click **"+ যোগ করুন"** to add
5. Click **"✓ আপডেট করুন"** when editing

**Example:**
- Name: রহিম
- Amount Paid: ৳200
- চা consumed: 3 cups

### Step 3: Calculate Settlement 🧮

1. Click **"🧮 ক্যালকুলেট করুন"** to calculate balances
2. View the summary table showing:
   - Total owed by each person
   - Amount paid by each person
   - Balance (positive = will receive, negative = needs to pay)
3. Read the **"সেটেলমেন্ট নির্দেশনা"** section for exact payment instructions

### Step 4: Export PDF 📄

1. After calculating, click **"📄 PDF ডাউনলোড করুন"**
2. A professional PDF report will be downloaded
3. Share it with your group or keep it for records

### Step 5: Clear Data (Optional) 🗑️

- Click **"🗑️ সব ডেটা মুছুন"** to reset everything
- Confirm the action in the dialog
- All items and participants will be removed

---

## 🛠️ Technology Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15+ | React framework with App Router |
| **TypeScript** | 5+ | Type-safe JavaScript |
| **React** | 18+ | UI library |
| **Tailwind CSS** | 4+ | Utility-first CSS framework |

### UI & Components

| Library | Purpose |
|---------|---------|
| **ShadCN/ui** | Pre-built accessible components |
| **Radix UI** | Headless UI primitives |
| **Lucide Icons** | Icon library |

### Additional Libraries

| Library | Purpose |
|---------|---------|
| **jsPDF** | PDF generation |
| **jsPDF-AutoTable** | PDF table formatting |
| **LocalStorage API** | Browser data persistence |
| **Cookies** | Theme persistence |

---

## 💡 Use Cases

This app is perfect for various scenarios:

### 🍕 **Social & Dining**
- Splitting restaurant bills among friends
- Sharing food delivery costs
- Dividing party expenses
- Coffee shop runs with colleagues

### 🚗 **Travel & Transportation**
- Road trip expense sharing (fuel, tolls, parking)
- Hotel room splitting
- Group tour cost division
- Uber/taxi fare sharing

### 🏠 **Living Arrangements**
- Roommate expense tracking
- Household grocery bills
- Utility bill splitting
- Shared subscription costs (Netflix, Spotify, etc.)

### 💼 **Work & Business**
- Office supply cost division
- Team lunch expenses
- Conference/workshop cost sharing
- Client entertainment expenses

### 🎁 **Events & Celebrations**
- Group gift contributions
- Wedding/birthday party expenses
- Anniversary celebration costs
- Holiday trip planning

---

### Development Guidelines

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Maintain Bengali language consistency
- Write clean, commented code
- Test thoroughly before submitting

---

**TL;DR:** You can use this project for any purpose, including commercial projects, as long as you include the original copyright notice.

---

## 👨‍💻 Author

**Shariar Hasan**

- GitHub: [@Shariar-Hasan](https://github.com/Shariar-Hasan)
- Email: [shahriar.hasan.1523@gmail.com](mailto:shahriar.hasan.1523@gmail.com)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [ShadCN/ui](https://ui.shadcn.com/) - Beautiful component library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [jsPDF](https://github.com/parallax/jsPDF) - PDF generation
- [Vercel](https://vercel.com/) - Deployment platform

---

## ⭐ Support

If you found this project helpful, please give it a ⭐ on GitHub!

<div align="center">

**Made with ❤️ and ☕ by [Shariar Hasan](https://github.com/Shariar-Hasan)**

</div>
