import createComponent from '@/components/components';
import FicusImage from '../../../public/files/ficus.png';
import IharPhoto from '../../../public/files/Ihar.png';
import LiudmilaPhoto from '../../../public/files/Liudmila.png';
import ValeriaPhoto from '../../../public/files/Valeria.png';
import GitIcon from '../../../public/files/github_icon.png';
import FicusIcon from '../../../public/files/ficusIcon.png';
import './about.scss';

const CLASS = {
  wrapper: ['about-page'],
  intro_section: ['intro-section'],
  intro_image: ['intro-image'],
  intro_text: ['intro-text'],
  team_section: ['team-section'],
  member: ['team-member'],
  photo_wrap: ['photo-wrap'],
  photo: ['photo-member'],
  title_wrap: ['title-wrap'],
  git_icon: ['git-icon'],
  name_wrap: ['name-wrap'],
  name_link: ['name-link'],
  name: ['name-member'],
  role: ['role-member'],
  bio_header: ['bio-header'],
  bio: ['bio-member'],
  works_wrap: ['works-wrap'],
  works_header: ['works-header'],
  works_list: ['works-list'],
  work_item: ['work-item'],
  work_icon: ['work-icon'],
  work_text: ['work-text'],
  divider: ['divider'],
};

interface Work {
  title: string;
}

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  photo: string;
  github: string;
  works: Work[];
}

const teamMembers: TeamMember[] = [
  {
    name: 'Liudmila Rodzina',
    role: 'Frontend Developer',
    bio: 'Entered the IT field unexpectedly in 2022 after working in a cruise company and receiving education in hospitality. Starting with Python, transitioned to JavaScript and decided to test skills in the Front-end course at RS School. Prseveres and continues to master new technologies and deepen knowledge in web development.',
    photo: LiudmilaPhoto,
    github: 'https://github.com/liudmilarodzina',
    works: [
      { title: 'Registration Page' },
      { title: 'Profile Page' },
      { title: 'Cart Page ...' },
    ],
  },
  {
    name: 'Ihar Bystrou',
    role: 'Team Lead, Frontend Developer',
    bio: 'Completed two courses at BSUIR. During studies, became interested in programming and learned C++. Discovered RS courses and JavaScript language. Passionate about expanding knowledge of technologies to confidently apply them in future developments.',
    photo: IharPhoto,
    github: 'https://github.com/k0nnte',
    works: [
      { title: 'Routing, Navigation' },
      { title: 'Catalog Page' },
      { title: 'Filtering, Sorting, Searching ...' },
    ],
  },

  {
    name: 'Valeria Stavriadi',
    role: 'Frontend Developer',
    bio: 'Worked as an accountant for a long time, nurturing a dream of a career in IT. Transitioned to frontend development after completing the "Web Developer" retraining course at ITMO. Discovered RS School, where currently studying and steadily advancing towards the goal.',
    photo: ValeriaPhoto,
    github: 'https://github.com/valeriastav',
    works: [
      { title: 'Login Page' },
      { title: 'Product Page' },
      { title: 'About Us Page ...' },
    ],
  },
];

export default class About {
  aboutPage: HTMLElement;

  constructor() {
    this.aboutPage = createComponent('div', CLASS.wrapper, {});
    this.addIntroduction();
    this.addTeamMembers();
  }

  addIntroduction() {
    const introSection = createComponent('div', CLASS.intro_section, {});
    const introImage = createComponent('img', CLASS.intro_image, {
      src: FicusImage,
      alt: 'IntroFicus',
    });
    const introText = createComponent('p', CLASS.intro_text, {});
    introText.innerHTML = `We are the web development team 'LIV', brought together by RS School in May 2024. Over the past two months, we've created this e-commerce application, working cohesively and effectively. By leveraging our strengths, we clearly defined roles, communicated actively through Discord, and tracked tasks on the GitHub project board. Regular meetings helped us address issues and monitor progress. We are proud of our application and grateful to RS School for the support and opportunity to realize this project.`;

    introSection.append(introImage, introText);

    this.aboutPage.appendChild(introSection);
  }

  static addWorksList(works: Work[]) {
    const worksList = createComponent('ul', CLASS.works_list, {});

    works.forEach((work) => {
      const workItem = createComponent('li', CLASS.work_item, {});

      const workIcon = createComponent('img', CLASS.work_icon, {
        src: FicusIcon,
        alt: 'Ficus Icon',
      });

      const workText = createComponent('span', CLASS.work_text, {});
      workText.textContent = work.title;

      workItem.append(workIcon, workText);
      worksList.appendChild(workItem);
    });
    return worksList;
  }

  addTeamMembers() {
    const teamSection = createComponent('div', CLASS.team_section, {});

    teamMembers.forEach((member) => {
      const teamMember = createComponent('div', CLASS.member, {});
      const photoWrap = createComponent('div', CLASS.photo_wrap, {});
      const photoMember = createComponent('img', CLASS.photo, {
        src: member.photo,
        alt: member.name,
      });
      photoWrap.appendChild(photoMember);

      const nameWrap = createComponent('div', CLASS.name_wrap, {});

      const titleWrap = createComponent('div', CLASS.title_wrap, {});

      const nameLink = createComponent('a', CLASS.name_link, {
        href: member.github,
      });

      nameWrap.appendChild(nameLink);

      const gitIcon = createComponent('img', CLASS.git_icon, {
        src: GitIcon,
        alt: 'GitHub',
      });

      const nameText = createComponent('h2', CLASS.name, {});
      nameText.textContent = member.name;
      nameLink.append(nameText, gitIcon);

      const roleText = createComponent('h3', CLASS.role, {});
      roleText.textContent = member.role;

      const bioText = createComponent('p', CLASS.bio, {});
      bioText.textContent = member.bio;
      bioText.classList.add('hidden');

      const bioHeader = createComponent('h4', CLASS.bio_header, {});
      bioHeader.textContent = 'Short Bio';
      bioHeader.innerHTML += ' &#9658;';

      bioHeader.addEventListener('click', () => {
        bioText.classList.toggle('hidden');
        bioHeader.innerHTML = bioText.classList.contains('hidden')
          ? 'Short Bio &#9658;'
          : 'Short Bio &#9660;';
      });

      const divider = createComponent('div', CLASS.divider, {});

      const worksWrap = createComponent('div', CLASS.works_wrap, {});
      const worksHeader = createComponent('h2', CLASS.works_header, {});
      worksHeader.textContent = 'Contributions to the project';
      const worksList = About.addWorksList(member.works);

      titleWrap.append(nameLink, roleText, bioHeader);

      // titleWrap.appendChild(bioText);

      worksWrap.append(worksHeader, worksList);

      teamMember.append(photoWrap, titleWrap, bioText, divider, worksWrap);
      teamSection.appendChild(teamMember);

      this.aboutPage.appendChild(teamSection);
    });
  }

  getWrap() {
    return this.aboutPage;
  }
}
