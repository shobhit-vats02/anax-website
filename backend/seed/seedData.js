const bcrypt = require('bcryptjs');
const Member = require('../models/Member');
const Achievement = require('../models/Achievement');
const MajorProject = require('../models/MajorProject');
const MiniProject = require('../models/MiniProject');
const Settings = require('../models/Settings');
const Admin = require('../models/Admin');

/* Same default content the old frontend-only DEFAULT_DATA shipped with,
   minus the plaintext password (that's now hashed separately below). */
const DEFAULTS = {
    tagline: '// Building the future, one line at a time',
    intro: 'We are <em><bold>ANAX CODE</bold></em> — a fierce team of innovators, developers, and problem solvers from <strong>Parul Institute of Engineering and Technology</strong>. From hackathons to real-world projects, we transform ideas into impactful digital solutions.',
    typingPhrases: [
        'Currently building something amazing',
        'Hackathon Grand Finalists',
        'Full-Stack Innovation Team',
        'Parul Institute of Engineering & Technology'
    ],
    contactInfo: {
        email: 'anaxcode.team@gmail.com',
        instagram: 'https://instagram.com/anaxcode',
        linkedin: 'https://linkedin.com/company/anaxcode',
        youtube: 'https://youtube.com/@anaxcode'
    },
    members: [
        { name: 'Member 1', role: 'Team Lead / Full-Stack Developer', photo: 'https://picsum.photos/seed/anax-m1/200/200.jpg', intro: 'Passionate full-stack developer who architects solutions from scratch.', socials: { linkedin: 'https://linkedin.com/in/', github: 'https://github.com/', leetcode: 'https://leetcode.com/', gmail: '', instagram: '' } },
        { name: 'Member 2', role: 'Backend Developer', photo: 'https://picsum.photos/seed/anax-m2/200/200.jpg', intro: 'Backend specialist building robust APIs and scalable architectures.', socials: { linkedin: 'https://linkedin.com/in/', github: 'https://github.com/', leetcode: '', gmail: '', instagram: '' } },
        { name: 'Member 3', role: 'Frontend / UI Developer', photo: 'https://picsum.photos/seed/anax-m3/200/200.jpg', intro: 'Crafts pixel-perfect interfaces with smooth animations.', socials: { linkedin: 'https://linkedin.com/in/', github: 'https://github.com/', leetcode: '', gmail: '', instagram: 'https://instagram.com/' } },
        { name: 'Member 4', role: 'AI / ML Engineer', photo: 'https://picsum.photos/seed/anax-m4/200/200.jpg', intro: 'Data-driven innovator building intelligent systems with ML.', socials: { linkedin: 'https://linkedin.com/in/', github: 'https://github.com/', leetcode: 'https://leetcode.com/', gmail: '', instagram: '' } },
        { name: 'Member 5', role: 'IoT / Hardware Specialist', photo: 'https://picsum.photos/seed/anax-m5/200/200.jpg', intro: 'Bridges physical-digital divide with IoT solutions.', socials: { linkedin: 'https://linkedin.com/in/', github: 'https://github.com/', leetcode: '', gmail: '', instagram: '' } }
    ],
    achievements: [
        { title: 'Vadodara Hackathon 6.0', rank: 'Grand Finalist', icon: 'fas fa-trophy', description: 'Competed against 200+ teams across Gujarat, presenting an innovative solution earning Grand Finale spot.', meta: [{ icon: 'fas fa-map-marker-alt', text: 'Vadodara, Gujarat' }, { icon: 'fas fa-users', text: '200+ Teams' }, { icon: 'fas fa-calendar', text: '2024' }] },
        { title: 'Smart India Hackathon', rank: 'Nominated', icon: 'fas fa-medal', description: "Officially nominated from Parul Institute of Engineering and Technology for India's biggest hackathon.", meta: [{ icon: 'fas fa-university', text: 'Parul Institute of Engg. & Tech.' }, { icon: 'fas fa-flag', text: 'National Level' }, { icon: 'fas fa-calendar', text: '2024' }] },
        { title: 'Kanan Hackathon', rank: 'Grand Finalist', icon: 'fas fa-crown', description: 'Secured Grand Finalist at Kanan Hackathon, delivering under extreme time pressure.', meta: [{ icon: 'fas fa-map-marker-alt', text: 'Kanan' }, { icon: 'fas fa-users', text: '150+ Teams' }, { icon: 'fas fa-calendar', text: '2024' }] }
    ],
    majorProjects: [
        { title: 'NeuraScope', status: 'completed', completion: 85, link: '', description: 'AI-powered medical imaging analysis tool for early disease detection using deep learning.', tags: ['Python', 'TensorFlow', 'Flask', 'React', 'OpenCV'] },
        { title: 'GuardianNet', status: 'ongoing', completion: 70, link: '', description: 'Real-time network intrusion detection system with ML-based anomaly detection.', tags: ['Python', 'Scikit-learn', 'Elasticsearch', 'Kafka', 'Docker'] },
        { title: 'KriishAI', status: 'completed', completion: 98, link: '', description: 'Intelligent agriculture assistant providing crop recommendations and soil analysis.', tags: ['Python', 'FastAPI', 'React', 'MongoDB', 'IoT'] }
    ],
    miniProjects: [
        { title: 'CodePulse Chat', desc: 'Real-time collaborative code editor with live chat', completion: 60, link: '' },
        { title: 'DataForge', desc: 'Visual data pipeline builder with drag-and-drop', completion: 40, link: '' },
        { title: 'SafeRoute', desc: 'Women safety app with GPS tracking and SOS alerts', completion: 80, link: '' },
        { title: 'Portfolio Website', desc: 'Personal portfolio with glass morphism UI', completion: 100, link: '' },
        { title: 'Weather Dashboard', desc: 'Real-time weather app with forecasts', completion: 90, link: '' },
        { title: 'Expense Tracker', desc: 'Budget tracking with charts and analytics', completion: 75, link: '' }
    ]
};

/* Seeds/reseeds content collections. Pass { resetOnly: true } to skip
   touching the Admin collection (used by the "Reset All" admin action so it
   never resets the current login password). */
const seedDatabase = async ({ resetOnly = false } = {}) => {
    await Promise.all([
        Member.deleteMany({}),
        Achievement.deleteMany({}),
        MajorProject.deleteMany({}),
        MiniProject.deleteMany({})
    ]);

    await Member.insertMany(DEFAULTS.members.map((m, i) => ({ ...m, order: i })));
    await Achievement.insertMany(DEFAULTS.achievements.map((a, i) => ({ ...a, order: i })));
    await MajorProject.insertMany(DEFAULTS.majorProjects.map((p, i) => ({ ...p, order: i })));
    await MiniProject.insertMany(DEFAULTS.miniProjects.map((p, i) => ({ ...p, order: i })));

    let settings = await Settings.findOne({ key: 'site_settings' });
    if (!settings) settings = new Settings({ key: 'site_settings' });
    settings.tagline = DEFAULTS.tagline;
    settings.intro = DEFAULTS.intro;
    settings.typingPhrases = DEFAULTS.typingPhrases;
    settings.contactInfo = DEFAULTS.contactInfo;
    await settings.save();

    if (!resetOnly) {
        const existingAdmin = await Admin.findOne({ username: 'admin' });
        if (!existingAdmin) {
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(process.env.ADMIN_DEFAULT_PASSWORD || 'anaxcode', salt);
            await Admin.create({ username: 'admin', passwordHash });
        }
    }
};

module.exports = seedDatabase;
module.exports.DEFAULTS = DEFAULTS;
