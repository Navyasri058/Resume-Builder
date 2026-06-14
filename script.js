const state = {
  currentScreen: 'landing',
  authMode: 'login',
  currentStep: 1,
  template: 'modern',
  personal: {
    name: '',
    email: '',
    phone: '',
    location: '',
    photo: '',
    linkedin: '',
    github: '',
    portfolio: '',
  },
  summary: {
    about: '',
    objective: '',
    bio: '',
  },
  education: [],
  skills: [],
  experience: [],
  projects: [],
  achievements: [],
  internships: [],
  additional: {
    languages: '',
    hobbies: '',
    volunteer: '',
    publications: '',
  },
};

const stepLabels = [
  'Personal Information',
  'Professional Summary',
  'Education',
  'Skills',
  'Experience',
  'Projects',
  'Achievements',
  'Internships',
  'Additional Sections',
];

const sectionConfig = {
  education: {
    container: 'educationList',
    fields: [
      { name: 'institution', placeholder: 'School / College name' },
      { name: 'degree', placeholder: 'Degree' },
      { name: 'branch', placeholder: 'Branch or major' },
      { name: 'start', placeholder: 'Start year' },
      { name: 'end', placeholder: 'End year' },
      { name: 'grade', placeholder: 'CGPA / Percentage' },
    ],
  },
  experience: {
    container: 'experienceList',
    fields: [
      { name: 'company', placeholder: 'Company name' },
      { name: 'role', placeholder: 'Role' },
      { name: 'duration', placeholder: 'Duration' },
      { name: 'responsibilities', placeholder: 'Responsibilities', type: 'textarea' },
      { name: 'tech', placeholder: 'Technologies used' },
    ],
  },
  project: {
    container: 'projectList',
    fields: [
      { name: 'title', placeholder: 'Project title' },
      { name: 'description', placeholder: 'Short description', type: 'textarea' },
      { name: 'technologies', placeholder: 'Technologies used' },
      { name: 'link', placeholder: 'GitHub / demo link' },
    ],
  },
  achievement: {
    container: 'achievementList',
    fields: [
      { name: 'title', placeholder: 'Award / Certification' },
      { name: 'organization', placeholder: 'Organization' },
      { name: 'year', placeholder: 'Year' },
      { name: 'description', placeholder: 'Brief detail', type: 'textarea' },
    ],
  },
  internship: {
    container: 'internshipList',
    fields: [
      { name: 'company', placeholder: 'Company name' },
      { name: 'role', placeholder: 'Internship role' },
      { name: 'duration', placeholder: 'Duration' },
      { name: 'description', placeholder: 'Description', type: 'textarea' },
      { name: 'skills', placeholder: 'Skills learned' },
    ],
  },
};

function saveState() {
  localStorage.setItem('navyaResumeState', JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem('navyaResumeState');
  if (!saved) return;
  try {
    const parsed = JSON.parse(saved);
    Object.assign(state, parsed);
  } catch (error) {
    console.warn('Unable to parse localStorage state', error);
  }
}

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach((screen) => screen.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
  state.currentScreen = screenId;
  saveState();
}

function setAuthMode(mode) {
  state.authMode = mode;
  document.getElementById('loginTab').classList.toggle('active', mode === 'login');
  document.getElementById('signupTab').classList.toggle('active', mode === 'signup');
  document.getElementById('confirmPasswordRow').classList.toggle('hidden', mode === 'login');
  document.getElementById('authSubmit').textContent = mode === 'login' ? 'Login' : 'Create account';
  document.getElementById('authSwitchText').innerHTML =
    mode === 'login'
      ? 'New here? <span id="authSwitchAction">Create account</span>'
      : 'Already have an account? <span id="authSwitchAction">Login</span>';
  addAuthSwitchListener();
}

function addAuthSwitchListener() {
  const switchAction = document.getElementById('authSwitchAction');
  if (!switchAction) return;
  switchAction.addEventListener('click', () => {
    setAuthMode(state.authMode === 'login' ? 'signup' : 'login');
  });
}

function handleAuthSubmit(event) {
  event.preventDefault();
  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value.trim();
  const confirmPassword = document.getElementById('authConfirmPassword').value.trim();
  const message = document.getElementById('authMessage');
  message.textContent = '';

  if (!email || !password) {
    message.textContent = 'Please enter your email and password.';
    return;
  }

  if (state.authMode === 'signup' && password !== confirmPassword) {
    message.textContent = 'Passwords do not match. Try again.';
    return;
  }

  if (document.getElementById('rememberMe').checked) {
    localStorage.setItem('navyaResumeRemember', email);
  }

  if (state.authMode === 'signup') {
    message.textContent = 'Account created successfully.';
  }

  showScreen('builderScreen');
}

function updateCurrentStep() {
  const step = Math.max(1, Math.min(9, state.currentStep));
  state.currentStep = step;
  document.getElementById('stepTitle').textContent = stepLabels[step - 1];
  document.getElementById('stepCounter').textContent = `${step} / 9`;
  document.querySelectorAll('.step-panel').forEach((panel) => {
    panel.classList.toggle('active', Number(panel.dataset.step) === step);
  });
  document.getElementById('prevStepBtn').disabled = step === 1;
  document.getElementById('nextStepBtn').textContent = step === 9 ? 'Choose Template' : 'Next';
  const progress = Math.round(((step - 1) / 8) * 100);
  document.getElementById('formProgress').value = progress;
  saveState();
}

function moveStep(direction) {
  if (direction === 'next') {
    if (state.currentStep === 9) {
      showScreen('templateScreen');
      return;
    }
    state.currentStep += 1;
  } else {
    state.currentStep -= 1;
  }
  updateCurrentStep();
}

function getElementValue(id) {
  return document.getElementById(id)?.value.trim() || '';
}

function updateStateFromInputs() {
  state.personal.name = getElementValue('fullName');
  state.personal.email = getElementValue('email');
  state.personal.phone = getElementValue('phone');
  state.personal.location = getElementValue('location');
  state.personal.linkedin = getElementValue('linkedin');
  state.personal.github = getElementValue('github');
  state.personal.portfolio = getElementValue('portfolio');

  state.summary.about = getElementValue('about');
  state.summary.objective = getElementValue('objective');
  state.summary.bio = getElementValue('bio');

  state.additional.languages = getElementValue('languages');
  state.additional.hobbies = getElementValue('hobbies');
  state.additional.volunteer = getElementValue('volunteer');
  state.additional.publications = getElementValue('publications');

  state.education = gatherSectionRows('education');
  state.experience = gatherSectionRows('experience');
  state.projects = gatherSectionRows('project');
  state.achievements = gatherSectionRows('achievement');
  state.internships = gatherSectionRows('internship');
}

function gatherSectionRows(section) {
  const { container, fields } = sectionConfig[section];
  const rows = Array.from(document.getElementById(container).querySelectorAll('.repeat-entry'));
  return rows
    .map((entry) => {
      const item = {};
      fields.forEach((field) => {
        const input = entry.querySelector(`[data-key="${field.name}"]`);
        item[field.name] = input ? input.value.trim() : '';
      });
      return item;
    })
    .filter((item) => Object.values(item).some(Boolean));
}

function createSectionEntry(section, data = {}) {
  const entry = document.createElement('div');
  entry.className = 'repeat-entry';

  sectionConfig[section].fields.forEach((field) => {
    const row = document.createElement('div');
    row.className = 'form-row';
    const inputId = `${section}-${field.name}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const label = document.createElement('label');
    label.textContent = field.placeholder;
    const input = field.type === 'textarea' ? document.createElement('textarea') : document.createElement('input');
    input.dataset.key = field.name;
    input.id = inputId;
    input.placeholder = field.placeholder;
    input.value = data[field.name] || '';
    input.addEventListener('input', () => {
      updateStateFromInputs();
      renderPreview('previewLive');
      renderPreview('previewFinal');
      saveState();
    });

    row.appendChild(label);
    row.appendChild(input);
    entry.appendChild(row);
  });

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className = 'remove-row';
  removeButton.textContent = 'Remove';
  removeButton.addEventListener('click', () => {
    entry.remove();
    updateStateFromInputs();
    renderPreview('previewLive');
    renderPreview('previewFinal');
    saveState();
  });

  entry.appendChild(removeButton);
  return entry;
}

function renderSectionEntries(section, values) {
  const container = document.getElementById(sectionConfig[section].container);
  container.innerHTML = '';
  if (!values.length) {
    container.appendChild(createSectionEntry(section));
    return;
  }
  values.forEach((item) => container.appendChild(createSectionEntry(section, item)));
}

function addSectionEntry(section) {
  const container = document.getElementById(sectionConfig[section].container);
  container.appendChild(createSectionEntry(section));
}

function renderSkillTags() {
  const skillsContainer = document.getElementById('skillsTags');
  skillsContainer.innerHTML = '';
  if (!state.skills.length) {
    const empty = document.createElement('p');
    empty.textContent = 'Add your core skills to build strong sections.';
    empty.style.color = 'var(--muted)';
    skillsContainer.appendChild(empty);
    return;
  }
  state.skills.forEach((skill, index) => {
    const tag = document.createElement('span');
    tag.className = 'skill-tag';
    tag.textContent = skill;
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = '×';
    remove.addEventListener('click', () => {
      state.skills.splice(index, 1);
      renderSkillTags();
      renderPreview('previewLive');
      renderPreview('previewFinal');
      saveState();
    });
    tag.appendChild(remove);
    skillsContainer.appendChild(tag);
  });
}

function addSkill() {
  const skillInput = document.getElementById('skillInput');
  const value = skillInput.value.trim();
  if (!value) return;
  if (!state.skills.includes(value)) {
    state.skills.push(value);
    skillInput.value = '';
    renderSkillTags();
    renderPreview('previewLive');
    renderPreview('previewFinal');
    saveState();
  }
}

function updatePhotoPreview() {
  const preview = document.getElementById('photoPreview');
  preview.innerHTML = '';
  if (!state.personal.photo) {
    preview.textContent = 'Add photo';
    return;
  }
  const image = document.createElement('img');
  image.src = state.personal.photo;
  preview.appendChild(image);
}

function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    state.personal.photo = reader.result;
    updatePhotoPreview();
    renderPreview('previewLive');
    renderPreview('previewFinal');
    saveState();
  };
  reader.readAsDataURL(file);
}

function getResumeCompletion() {
  const pieces = [
    state.personal.name,
    state.personal.email,
    state.personal.phone,
    state.personal.location,
    state.summary.about,
    state.summary.objective,
    state.education.length > 0,
    state.skills.length > 0,
    state.experience.length > 0,
    state.projects.length > 0,
    state.achievements.length > 0,
    state.internships.length > 0,
  ];
  const filled = pieces.filter(Boolean).length;
  return Math.min(100, Math.round((filled / pieces.length) * 100));
}

function buildPreviewSections(container) {
  container.innerHTML = '';

  const header = document.createElement('div');
  header.className = 'resume-header';
  const title = document.createElement('h1');
  title.textContent = state.personal.name || 'Navya Sharma';
  header.appendChild(title);

  const meta = document.createElement('div');
  meta.className = 'preview-meta';
  const contactItems = [
    state.personal.email,
    state.personal.phone,
    state.personal.location,
  ].filter(Boolean);
  contactItems.forEach((item) => {
    const span = document.createElement('span');
    span.textContent = item;
    meta.appendChild(span);
  });

  const links = [
    { label: 'LinkedIn', value: state.personal.linkedin },
    { label: 'GitHub', value: state.personal.github },
    { label: 'Portfolio', value: state.personal.portfolio },
  ].filter((item) => item.value);
  links.forEach((item) => {
    const span = document.createElement('span');
    span.textContent = `${item.label}: ${item.value}`;
    meta.appendChild(span);
  });

  if (meta.children.length) {
    header.appendChild(meta);
  }

  if (state.personal.photo) {
    const photo = document.createElement('img');
    photo.src = state.personal.photo;
    photo.alt = 'Profile photo';
    photo.style.width = '96px';
    photo.style.height = '96px';
    photo.style.objectFit = 'cover';
    photo.style.borderRadius = '18px';
    photo.style.marginTop = '12px';
    header.appendChild(photo);
  }

  container.appendChild(header);

  const content = document.createElement('div');
  content.className = 'preview-grid';

  const createSection = (title, contentNode) => {
    const section = document.createElement('div');
    section.className = 'preview-section';
    const heading = document.createElement('h3');
    heading.textContent = title;
    section.appendChild(heading);
    section.appendChild(contentNode);
    content.appendChild(section);
  };

  const profileBlock = document.createElement('div');
  profileBlock.className = 'section-row';
  if (state.summary.about) {
    const p = document.createElement('p');
    p.textContent = state.summary.about;
    profileBlock.appendChild(p);
  }
  if (state.summary.objective) {
    const p = document.createElement('p');
    p.textContent = state.summary.objective;
    profileBlock.appendChild(p);
  }
  if (state.summary.bio) {
    const p = document.createElement('p');
    p.textContent = state.summary.bio;
    profileBlock.appendChild(p);
  }
  if (profileBlock.children.length) createSection('Profile', profileBlock);

  if (state.education.length) {
    const block = document.createElement('div');
    block.className = 'section-row';
    state.education.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'list-item';
      const title = document.createElement('strong');
      title.textContent = `${item.degree || item.institution || ''}`.trim();
      row.appendChild(title);
      const subtitle = document.createElement('span');
      subtitle.textContent = `${item.institution || ''} ${item.branch ? `• ${item.branch}` : ''}`.trim();
      row.appendChild(subtitle);
      const dates = document.createElement('span');
      dates.textContent = `${item.start || ''} — ${item.end || ''}`.trim();
      row.appendChild(dates);
      if (item.grade) {
        const grade = document.createElement('span');
        grade.textContent = `Grade: ${item.grade}`;
        row.appendChild(grade);
      }
      block.appendChild(row);
    });
    createSection('Education', block);
  }

  if (state.skills.length) {
    const skillBlock = document.createElement('div');
    skillBlock.className = 'profile-badges';
    state.skills.forEach((skill) => {
      const badge = document.createElement('span');
      badge.className = 'profile-badge';
      badge.textContent = skill;
      skillBlock.appendChild(badge);
    });
    createSection('Skills', skillBlock);
  }

  if (state.experience.length) {
    const block = document.createElement('div');
    block.className = 'section-row';
    state.experience.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'list-item';
      const title = document.createElement('strong');
      title.textContent = `${item.role || item.company || ''}`.trim();
      row.appendChild(title);
      const subtitle = document.createElement('span');
      subtitle.textContent = `${item.company || ''} • ${item.duration || ''}`.trim();
      row.appendChild(subtitle);
      if (item.responsibilities) {
        const p = document.createElement('p');
        p.textContent = item.responsibilities;
        row.appendChild(p);
      }
      if (item.tech) {
        const tech = document.createElement('span');
        tech.textContent = `Tech: ${item.tech}`;
        row.appendChild(tech);
      }
      block.appendChild(row);
    });
    createSection('Experience', block);
  }

  if (state.projects.length) {
    const block = document.createElement('div');
    block.className = 'section-row';
    state.projects.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'list-item';
      const title = document.createElement('strong');
      title.textContent = item.title || 'Project';
      row.appendChild(title);
      if (item.description) {
        const p = document.createElement('p');
        p.textContent = item.description;
        row.appendChild(p);
      }
      if (item.technologies) {
        const tech = document.createElement('span');
        tech.textContent = `Tech: ${item.technologies}`;
        row.appendChild(tech);
      }
      if (item.link) {
        const link = document.createElement('span');
        link.textContent = `Link: ${item.link}`;
        row.appendChild(link);
      }
      block.appendChild(row);
    });
    createSection('Projects', block);
  }

  if (state.achievements.length) {
    const block = document.createElement('div');
    block.className = 'section-row';
    state.achievements.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'list-item';
      const title = document.createElement('strong');
      title.textContent = item.title || 'Achievement';
      row.appendChild(title);
      if (item.organization) {
        const org = document.createElement('span');
        org.textContent = `${item.organization} • ${item.year || ''}`.trim();
        row.appendChild(org);
      }
      if (item.description) {
        const p = document.createElement('p');
        p.textContent = item.description;
        row.appendChild(p);
      }
      block.appendChild(row);
    });
    createSection('Achievements', block);
  }

  if (state.internships.length) {
    const block = document.createElement('div');
    block.className = 'section-row';
    state.internships.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'list-item';
      const title = document.createElement('strong');
      title.textContent = `${item.role || item.company || ''}`.trim();
      row.appendChild(title);
      const subtitle = document.createElement('span');
      subtitle.textContent = `${item.company || ''} • ${item.duration || ''}`.trim();
      row.appendChild(subtitle);
      if (item.description) {
        const p = document.createElement('p');
        p.textContent = item.description;
        row.appendChild(p);
      }
      if (item.skills) {
        const skills = document.createElement('span');
        skills.textContent = `Skills learned: ${item.skills}`;
        row.appendChild(skills);
      }
      block.appendChild(row);
    });
    createSection('Internships', block);
  }

  const additionalItems = {
    Languages: state.additional.languages,
    Hobbies: state.additional.hobbies,
    'Volunteer Work': state.additional.volunteer,
    Publications: state.additional.publications,
  };
  const additionalBlock = document.createElement('div');
  additionalBlock.className = 'section-row';
  Object.entries(additionalItems).forEach(([title, value]) => {
    if (!value) return;
    const row = document.createElement('div');
    row.className = 'list-item';
    const heading = document.createElement('strong');
    heading.textContent = title;
    const text = document.createElement('p');
    text.textContent = value;
    row.appendChild(heading);
    row.appendChild(text);
    additionalBlock.appendChild(row);
  });
  if (additionalBlock.children.length) createSection('Additional', additionalBlock);

  container.appendChild(content);
}

function renderPreview(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.className = `preview-wrapper template-${state.template}`;
  buildPreviewSections(container);
}

function updateResumeCompletion() {
  const value = getResumeCompletion();
  document.getElementById('resumeCompletion').value = value;
  document.getElementById('resumeCompletionLabel').textContent = `${value}%`;
}

function renderTemplateList() {
  document.querySelectorAll('.template-card').forEach((card) => {
    card.classList.toggle('selected', card.dataset.template === state.template);
  });
}

function selectTemplate(template) {
  state.template = template;
  renderTemplateList();
  renderPreview('previewLive');
  renderPreview('previewFinal');
  saveState();
}

function downloadResume() {
  const element = document.getElementById('previewFinal');
  const options = {
    margin: 0.6,
    filename: 'Navya-Resume.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
  };
  html2pdf().set(options).from(element).save();
}

function printResume() {
  const preview = document.getElementById('previewFinal');
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  printWindow.document.write(`
    <html>
      <head>
        <title>Print Resume</title>
        <link rel="stylesheet" href="styles.css" />
      </head>
      <body style="margin:0;background:#081125;color:#edf2ff;">
        ${preview.outerHTML}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
}

function populateForm() {
  document.getElementById('fullName').value = state.personal.name;
  document.getElementById('email').value = state.personal.email;
  document.getElementById('phone').value = state.personal.phone;
  document.getElementById('location').value = state.personal.location;
  document.getElementById('linkedin').value = state.personal.linkedin;
  document.getElementById('github').value = state.personal.github;
  document.getElementById('portfolio').value = state.personal.portfolio;
  document.getElementById('about').value = state.summary.about;
  document.getElementById('objective').value = state.summary.objective;
  document.getElementById('bio').value = state.summary.bio;
  document.getElementById('languages').value = state.additional.languages;
  document.getElementById('hobbies').value = state.additional.hobbies;
  document.getElementById('volunteer').value = state.additional.volunteer;
  document.getElementById('publications').value = state.additional.publications;
  renderSectionEntries('education', state.education);
  renderSectionEntries('experience', state.experience);
  renderSectionEntries('project', state.projects);
  renderSectionEntries('achievement', state.achievements);
  renderSectionEntries('internship', state.internships);
  renderSkillTags();
  updatePhotoPreview();
}

function bindActions() {
  document.getElementById('getStartedBtn').addEventListener('click', () => showScreen('authScreen'));
  document.getElementById('loginBtn').addEventListener('click', () => {
    setAuthMode('login');
    showScreen('authScreen');
  });
  document.getElementById('signupBtn').addEventListener('click', () => {
    setAuthMode('signup');
    showScreen('authScreen');
  });
  document.getElementById('loginTab').addEventListener('click', () => setAuthMode('login'));
  document.getElementById('signupTab').addEventListener('click', () => setAuthMode('signup'));
  document.getElementById('authForm').addEventListener('submit', handleAuthSubmit);
  document.getElementById('nextStepBtn').addEventListener('click', () => {
    updateStateFromInputs();
    renderPreview('previewLive');
    renderPreview('previewFinal');
    updateResumeCompletion();
    moveStep('next');
  });
  document.getElementById('prevStepBtn').addEventListener('click', () => moveStep('prev'));
  document.getElementById('addEduBtn').addEventListener('click', () => addSectionEntry('education'));
  document.getElementById('addExpBtn').addEventListener('click', () => addSectionEntry('experience'));
  document.getElementById('addProjectBtn').addEventListener('click', () => addSectionEntry('project'));
  document.getElementById('addAchievementBtn').addEventListener('click', () => addSectionEntry('achievement'));
  document.getElementById('addInternshipBtn').addEventListener('click', () => addSectionEntry('internship'));
  document.getElementById('addSkillBtn').addEventListener('click', addSkill);
  document.getElementById('skillInput').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addSkill();
    }
  });
  document.getElementById('photoUpload').addEventListener('change', handlePhotoUpload);
  document.getElementById('backToBuilder').addEventListener('click', () => showScreen('builderScreen'));
  document.getElementById('downloadResume').addEventListener('click', downloadResume);
  document.getElementById('printResume').addEventListener('click', printResume);

  document.querySelectorAll('.template-card').forEach((card) => {
    card.addEventListener('click', () => selectTemplate(card.dataset.template));
  });

  ['fullName', 'email', 'phone', 'location', 'linkedin', 'github', 'portfolio', 'about', 'objective', 'bio', 'languages', 'hobbies', 'volunteer', 'publications'].forEach((id) => {
    document.getElementById(id).addEventListener('input', () => {
      updateStateFromInputs();
      renderPreview('previewLive');
      renderPreview('previewFinal');
      updateResumeCompletion();
      saveState();
    });
  });
}

function loadRememberedEmail() {
  const remembered = localStorage.getItem('navyaResumeRemember');
  if (remembered) {
    document.getElementById('authEmail').value = remembered;
  }
}

function initialize() {
  loadState();
  bindActions();
  addAuthSwitchListener();
  loadRememberedEmail();
  populateForm();
  updateCurrentStep();
  renderSkillTags();
  renderTemplateList();
  renderPreview('previewLive');
  renderPreview('previewFinal');
  updateResumeCompletion();
  if (state.currentScreen !== 'landing') {
    showScreen(state.currentScreen);
  }
}

document.addEventListener('DOMContentLoaded', initialize);
