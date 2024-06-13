import createComponent from '@/components/components';
import About from './about';

jest.mock('@/components/components');

describe('About', () => {
  let about: About;

  beforeEach(() => {
    jest.clearAllMocks();

    (createComponent as jest.Mock).mockImplementation((tag, classes, attrs) => {
      const element = document.createElement(tag);
      element.className = classes.join(' ');
      Object.keys(attrs).forEach((key) => {
        const value = attrs[key];
        if (
          typeof value === 'string' ||
          typeof value === 'number' ||
          typeof value === 'boolean'
        ) {
          element.setAttribute(key, String(value));
        }
      });
      return element;
    });

    about = new About();
  });

  it('should create about page with wrapper', () => {
    const aboutPage = about.getWrap();
    expect(aboutPage).toBeDefined();
    expect(aboutPage.className).toBe('about-page');
  });

  it('should add introduction section', () => {
    const aboutPage = about.getWrap();
    const introSection = aboutPage.querySelector('.intro-section');
    expect(introSection).toBeDefined();
    const introImage = introSection?.querySelector('.intro-image');
    expect(introImage).toBeDefined();
    expect(introImage?.getAttribute('alt')).toBe('IntroFicus');
    const introText = introSection?.querySelector('.intro-text');
    expect(introText).toBeDefined();
    expect(introText?.innerHTML).toContain('We are the web development team');
  });

  it('should add team members', () => {
    const aboutPage = about.getWrap();
    const teamMembers = aboutPage.querySelectorAll('.team-member');
    expect(teamMembers.length).toBe(3);

    teamMembers.forEach((member) => {
      const photo = member.querySelector('.photo-member');
      const nameLink = member.querySelector('.name-link');
      const roleText = member.querySelector('.role-member');
      const bioText = member.querySelector('.bio-member');
      const bioHeader = member.querySelector('.bio-header');
      const worksList = member.querySelectorAll('.work-item');

      expect(photo).toBeDefined();
      expect(nameLink).toBeDefined();
      expect(roleText).toBeDefined();
      expect(bioText).toBeDefined();
      expect(bioHeader).toBeDefined();
      expect(worksList.length).toBeGreaterThan(0);
    });
  });

  it('should toggle bio visibility on bio header click', () => {
    const aboutPage = about.getWrap();
    const bioHeader = aboutPage.querySelector('.bio-header') as HTMLElement;
    const bioText = aboutPage.querySelector('.bio-member');

    expect(bioText?.classList.contains('hidden')).toBe(true);

    bioHeader?.click();
    expect(bioText?.classList.contains('hidden')).toBe(false);

    bioHeader?.click();
    expect(bioText?.classList.contains('hidden')).toBe(true);
  });

  it('should add works list for each team member', () => {
    const aboutPage = about.getWrap();
    const teamMembers = aboutPage.querySelectorAll('.team-member');

    teamMembers.forEach((member) => {
      const worksList = member.querySelectorAll('.work-item');
      expect(worksList.length).toBeGreaterThan(0);
    });
  });
});
