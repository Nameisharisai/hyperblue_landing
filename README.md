# Hyperblue - Space Technology Landing Page (LAN Version)

A high-end, cinematic, responsive landing page for Hyperblue, a global space technology company currently in the Research & Development phase. This LAN version is optimized for local network use with reduced dependencies and enhanced local rendering.

## 🚀 Features

- **Cinematic Design**: Pure black background with silver/blue accents
- **Responsive Layout**: Optimized for all devices
- **Smooth Animations**: THREE.js powered 3D visualizations and animations
- **Glassmorphism Navigation**: Modern navigation bar with blur effects
- **Interactive Elements**: Hover effects, animated components, and form validation
- **Performance Optimized**: Local-friendly design with fallback options
- **LAN Optimized**: Reduced external dependencies for better local network performance

## 🛠 Technology Stack

- **HTML5**: Semantic markup and modern structure
- **CSS3**: Advanced animations, grid/flexbox layouts, glassmorphism effects
- **Vanilla JavaScript**: Interactive functionality and smooth animations
- **THREE.js**: 3D visualization library for interactive elements
- **Google Fonts**: Inter and Orbitron for modern typography (with local fallbacks)

## 🌟 Sections

1. **Hero Section**: Engineering the New Era of Space
2. **Mission**: Company vision and goals
3. **R&D**: Interactive 3D data visualization of research projects
4. **Kronos Engine**: Heat Into Power propulsion system with cooling ring animation
5. **Nebula 1**: Built to Return launch vehicle
6. **Hypercluster**: Orbital Autonomy satellite constellation
7. **Contact**: Get in Orbit With Us

## 🚀 Getting Started

### Prerequisites
- Node.js (for development server)
- Modern web browser

### Installation

1. Clone or download the project
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

1. Start the development server:
   ```bash
   # Using Node.js live-server (recommended for LAN)
   npx live-server public
   ```

2. Open your browser and navigate to the URL shown in the terminal (typically `http://127.0.0.1:8080`)

3. For LAN access, share the server's IP address and port with other devices on the same network

### Alternative (Simple HTTP Server)

You can also serve the files using any HTTP server:
```bash
# Using Python 3
python -m http.server 8080

# Using Python 2
python -m SimpleHTTPServer 8080

# Using Node.js http-server
npx http-server
```

## 📄 Available Versions

- **lan-version.html**: Optimized for local network use with THREE.js loaded from CDN
- **index.html**: Standard version with all features
- **simple.html**: Ultra-lightweight version

## 🔄 Latest Updates

### R&D Visualization
- Added an interactive 3D data visualization to the R&D section
- Features animated data nodes orbiting a central hub with connection lines
- Includes animated data packets traveling along connections
- Dynamic grid visualization with wave animation

### Kronos Engine Improvements
- Replaced the heat distribution box with animated cooling rings
- Enhanced thermal visualization with pulsing animation effects
- Improved flame animation for the engine nozzle

### Responsive Enhancements
- Optimized R&D visualization for mobile devices
- Added graceful fallbacks for browsers without WebGL support
- Improved rendering performance for local network use

## 📱 Responsive Design

The website is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (480px - 767px)
- Small Mobile (< 480px)

## 🔧 Customization

### Modifying Content
- Edit `index.html` for content changes
- Update `styles.css` for design modifications
- Modify `script.js` for functionality changes

### Adding New Sections
1. Add HTML structure to `index.html`
2. Add corresponding styles to `styles.css`
3. Add any interactive functionality to `script.js`
4. Update navigation links

## 📈 Performance

- Optimized animations using `requestAnimationFrame`
- Efficient CSS animations with GPU acceleration
- Minimal JavaScript footprint
- Optimized for fast loading and smooth performance

## 🌐 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## 📄 License

This project is licensed under the MIT License.

## 🚀 Deployment

The project consists of static files that can be deployed to any web server:
- GitHub Pages
- Netlify
- Vercel
- Traditional web hosting

Simply upload the files to your web server root directory.

---

**Hyperblue** - Engineering the New Era of Space
