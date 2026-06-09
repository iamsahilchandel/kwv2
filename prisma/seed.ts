import { PrismaClient, ServiceGroup } from '../src/generated/prisma';

const prisma = new PrismaClient();

const AMENITIES = [
  'spacious',
  'well-ventilated',
  'age-appropriate-spaces',
  'sports-&-fitness-equipment',
  'musical-instruments',
  'cctv-surveillance',
  'trained-staff-&-instructors',
  'security-guards',
  'first-aid',
  'medical-assistance',
  'clean-restrooms',
  'cafeteria',
  'parking',
  'transportation',
  'child-friendly',
  'parent-friendly',
  'eco-friendly',
  'wheelchair-accessible',
  'hygiene',
  'fire-safety',
  'emergency-exit',
  'library',
  'play-area',
  'activity-area',
  'sports-area',
  'dance-studio',
  'music-room',
  'art-room',
  'science-lab',
  'computer-lab',
  'audio-visual-room',
  'smart-classrooms',
  'open-air-theatre',
  'auditorium',
  'stage',
  'greenery',
  'garden',
  'outdoor-play-area',
  'indoor-play-area',
  'swimming-pool',
  'gym',
  'yoga-room',
  'meditation-room',
  'changing-rooms',
  'locker-facility',
  'water-cooler',
];

const SERVICES: Record<string, string[]> = {
  'Sports and Physical Activities': [
    'Archery',
    'Badminton',
    'Basketball',
    'Boxing',
    'Cricket',
    'Football',
    'Golf',
    'Gymnastics',
    'Horse Riding',
    'Martial Arts',
    'Shooting',
    'Skating',
    'Swimming',
    'Lawn Tennis',
    'Squash',
    'Wrestling',
    'Chess',
    'Taekwondo',
  ],
  'Dance and Fitness': [
    'Ballet',
    'Kathak',
    'Bharatnatyam',
    'Western Dance',
    'Bollywood',
    'Zumba',
    'Yoga',
  ],
  'Music and Performing Arts': [
    'Drums',
    'Flute',
    'Guitar',
    'Piano',
    'Singing',
    'Tabla',
    'Violin',
    'Theatre',
  ],
  'Art and Creativity': ['Art', 'Crafts', 'Pottery', 'Photography'],
  'Academic and Skill Development': [
    'German',
    'Spanish',
    'Japanese',
    'English',
    'Public Speaking',
    'Book Reading',
    'Personality Development',
    'Robotics',
  ],
};

const SERVICE_GROUP_MAP: Record<string, ServiceGroup> = {
  'Sports and Physical Activities': ServiceGroup.sports_and_physical_activities,
  'Dance and Fitness': ServiceGroup.dance_and_fitness,
  'Music and Performing Arts': ServiceGroup.music_and_performing_arts,
  'Art and Creativity': ServiceGroup.art_and_creativity,
  'Academic and Skill Development': ServiceGroup.academic_and_skill_development,
};

function toTitleCase(str: string): string {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

async function seedAmenities() {
  const data = AMENITIES.map((slug) => ({
    amenityName: toTitleCase(slug),
  }));

  for (const amenity of data) {
    await prisma.ameneties.upsert({
      where: { amenityName: amenity.amenityName },
      update: {},
      create: amenity,
    });
  }

  console.log(`Seeded ${data.length} amenities`);
}

async function seedServices() {
  let count = 0;

  for (const [group, services] of Object.entries(SERVICES)) {
    const serviceGroup = SERVICE_GROUP_MAP[group];

    for (const serviceName of services) {
      await prisma.services.upsert({
        where: { serviceName },
        update: {},
        create: {
          serviceName,
          serviceGroup,
          description: `${serviceName} - ${group}`,
        },
      });
      count++;
    }
  }

  console.log(`Seeded ${count} services`);
}

async function main() {
  console.log('Seeding amenities and services...');
  await seedAmenities();
  await seedServices();
  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
