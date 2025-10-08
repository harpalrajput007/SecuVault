# 🔐 SecuVault - Secure Password Manager

A privacy-first password manager with client-side encryption built with Next.js, TypeScript, Node.js, and MongoDB.

## 🌟 Features

### 🔒 **Security & Privacy**
- **Client-side encryption** - All vault data encrypted in browser before transmission
- **Zero-knowledge architecture** - Server never sees plaintext passwords
- **AES-256 encryption** with PBKDF2 key derivation
- **Two-factor authentication** (TOTP) with QR code setup
- **Auto-clear clipboard** after 15 seconds for security
- **JWT authentication** with HttpOnly cookies

### 🚀 **Core Features**
- **Password generator** with customizable options and strength indicator
- **Secure vault** for passwords, usernames, URLs, and notes
- **Categories & tags** for organization (Work, Personal, Banking, etc.)
- **Favorites** system for quick access to important entries
- **Advanced search & filtering** by category, favorites, and text
- **Analytics dashboard** with security score and insights
- **PDF export** of all vault entries
- **Real-time search** with instant results
- **Dark/light mode** toggle

### 🎨 **User Experience**
- **Responsive design** - Works on desktop, tablet, and mobile
- **Clean, minimal UI** with smooth animations
- **Professional green color scheme** for trust and security
- **Intuitive navigation** with keyboard shortcuts
- **Loading states** and error handling throughout

## 🛠 Tech Stack

### **Frontend**
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons
- **CryptoJS** - Client-side encryption library
- **jsPDF** - PDF generation for exports
- **Axios** - HTTP client for API calls

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type safety for backend code
- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB object modeling
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT token generation
- **Speakeasy** - TOTP 2FA implementation
- **QRCode** - QR code generation for 2FA

## 📦 Installation & Setup

### **Prerequisites**
- Node.js 18+ installed
- MongoDB Atlas account (free tier available)
- Git installed

### **1. Clone Repository**
```bash
git clone <repository-url>
cd SecuVault
```

### **2. Backend Setup**
```bash
cd backend
npm install
```

Create `.env` file in backend directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
NODE_ENV=development
```

### **3. Frontend Setup**
```bash
cd ../frontend
npm install
```

### **4. Start Development Servers**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### **5. Access Application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🚀 Deployment

### **Backend Deployment (Railway/Render/Heroku)**
1. Create account on Railway/Render/Heroku
2. Connect your GitHub repository
3. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
4. Deploy from `backend` folder

### **Frontend Deployment (Vercel/Netlify)**
1. Create account on Vercel/Netlify
2. Connect your GitHub repository
3. Set build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Root Directory**: `frontend`
4. Set environment variable:
   - `NEXT_PUBLIC_API_URL=your_backend_url`
5. Deploy

### **Environment Variables**

**Backend (.env):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/secuvault
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
PORT=5000
NODE_ENV=production
```

**Frontend (Vercel/Netlify):**
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

## 🔐 Security Implementation

### **Client-Side Encryption**
```javascript
// User's password derives encryption key
const key = CryptoJS.PBKDF2(userPassword, salt, {
  keySize: 256/32,
  iterations: 10000
});

// All vault data encrypted before sending to server
const encrypted = CryptoJS.AES.encrypt(plaintext, key).toString();
```

### **Zero-Knowledge Architecture**
- User password never sent to server
- All encryption/decryption happens in browser
- Server only stores encrypted blobs
- Even database administrators cannot see plaintext data

### **Two-Factor Authentication**
- TOTP (Time-based One-Time Password) standard
- Compatible with Google Authenticator, Authy, etc.
- 30-second time windows with 2-minute tolerance
- QR code setup with manual backup key

## 📊 API Documentation

### **Authentication Endpoints**
```
POST /api/auth/register     - User registration
POST /api/auth/login        - User login (with optional 2FA)
POST /api/auth/logout       - User logout
POST /api/auth/2fa/setup    - Setup 2FA (returns QR code)
POST /api/auth/2fa/verify   - Verify 2FA code
```

### **Vault Endpoints**
```
GET    /api/vault           - Get all vault items (with search)
POST   /api/vault           - Create new vault item
GET    /api/vault/:id       - Get specific vault item
PUT    /api/vault/:id       - Update vault item
DELETE /api/vault/:id       - Delete vault item
```

### **Request/Response Examples**

**Create Vault Item:**
```json
POST /api/vault
{
  "title": "encrypted_title",
  "username": "encrypted_username", 
  "password": "encrypted_password",
  "url": "encrypted_url",
  "notes": "encrypted_notes",
  "category": "Work",
  "isFavorite": false
}
```

## 🧪 Testing

### **Manual Testing Checklist**
- [ ] User registration and login
- [ ] Password generation with different options
- [ ] Vault entry creation, editing, deletion
- [ ] Search and filtering functionality
- [ ] Category and favorites system
- [ ] 2FA setup and login flow
- [ ] PDF export functionality
- [ ] Analytics dashboard
- [ ] Dark/light mode toggle
- [ ] Responsive design on mobile

### **Security Testing**
- [ ] Verify encrypted data in MongoDB
- [ ] Test 2FA with authenticator app
- [ ] Confirm clipboard auto-clear
- [ ] Check JWT token security
- [ ] Validate CORS settings

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **CryptoJS** for client-side encryption
- **Speakeasy** for TOTP implementation
- **Tailwind CSS** for beautiful styling
- **Lucide** for clean icons
- **MongoDB Atlas** for reliable database hosting
