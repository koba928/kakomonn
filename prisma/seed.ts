import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Sample universities
  const tokyoUniversity = await prisma.university.upsert({
    where: { name: '東京大学' },
    update: {},
    create: {
      name: '東京大学',
      domain: 'u-tokyo.ac.jp',
    },
  })

  const wasedaUniversity = await prisma.university.upsert({
    where: { name: '早稲田大学' },
    update: {},
    create: {
      name: '早稲田大学',
      domain: 'waseda.jp',
    },
  })

  const keioUniversity = await prisma.university.upsert({
    where: { name: '慶應義塾大学' },
    update: {},
    create: {
      name: '慶應義塾大学',
      domain: 'keio.jp',
    },
  })

  // Sample faculties for Tokyo University
  const engineeringFaculty = await prisma.faculty.upsert({
    where: { 
      universityId_name: {
        universityId: tokyoUniversity.id,
        name: '工学部'
      }
    },
    update: {},
    create: {
      name: '工学部',
      universityId: tokyoUniversity.id,
    },
  })

  const economicsFaculty = await prisma.faculty.upsert({
    where: { 
      universityId_name: {
        universityId: tokyoUniversity.id,
        name: '経済学部'
      }
    },
    update: {},
    create: {
      name: '経済学部',
      universityId: tokyoUniversity.id,
    },
  })

  // Sample faculties for Waseda University
  const wasedaEconomics = await prisma.faculty.upsert({
    where: { 
      universityId_name: {
        universityId: wasedaUniversity.id,
        name: '政治経済学部'
      }
    },
    update: {},
    create: {
      name: '政治経済学部',
      universityId: wasedaUniversity.id,
    },
  })

  // Sample courses
  const macroeconomics = await prisma.course.upsert({
    where: {
      facultyId_name_professor: {
        facultyId: economicsFaculty.id,
        name: 'マクロ経済学',
        professor: '田中教授'
      }
    },
    update: {},
    create: {
      name: 'マクロ経済学',
      professor: '田中教授',
      code: 'ECON101',
      facultyId: economicsFaculty.id,
    },
  })

  const calculus = await prisma.course.upsert({
    where: {
      facultyId_name_professor: {
        facultyId: engineeringFaculty.id,
        name: '微積分学',
        professor: '山田教授'
      }
    },
    update: {},
    create: {
      name: '微積分学',
      professor: '山田教授',
      code: 'MATH101',
      facultyId: engineeringFaculty.id,
    },
  })

  console.log('Database has been seeded. 🌱')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })