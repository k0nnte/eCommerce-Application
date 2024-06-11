import createComponent from '@/components/components';
import FicusImage from '../../../public/files/ficus.png';
import IharPhoto from '../../../public/files/Ihar.png';
import LiudmilaPhoto from '../../../public/files/Liudmila.png';
import ValeriaPhoto from '../../../public/files/Valeria.png';
import GitIcon from '../../../public/files/github_icon.png';
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
  bio: ['bio-member'],
};

const teamMembers = [
  {
    name: 'Ihar Bystrou',
    role: 'Team Lead',
    bio: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
    photo: IharPhoto,
    github: 'https://github.com/k0nnte',
  },
  {
    name: 'Liudmila Rodzina',
    role: 'Team Member',
    bio: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
    photo: LiudmilaPhoto,
    github: 'https://github.com/liudmilarodzina',
  },
  {
    name: 'Valeria Stavriadi',
    role: 'Team Member',
    bio: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
    photo: ValeriaPhoto,
    github: 'https://github.com/valeriastav',
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
    introText.textContent =
      'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a,';

    introSection.append(introImage, introText);

    this.aboutPage.appendChild(introSection);
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

      titleWrap.append(nameLink, roleText);

      const bioText = createComponent('p', CLASS.bio, {});
      bioText.textContent = member.bio;

      teamMember.append(photoWrap, titleWrap, bioText);

      teamSection.appendChild(teamMember);

      this.aboutPage.appendChild(teamSection);
    });
  }

  getWrap() {
    return this.aboutPage;
  }
}
