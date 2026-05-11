const { prisma } = require('../src/lib/prisma');

async function testUpdate() {
  try {
    const userId = "tutor_6vbtscv321741624632766"; // Example ID, I should check real ones
    
    // Find a tutor first
    const tutor = await prisma.user.findFirst({
      where: { role: 'TUTOR' },
      include: { tutorProfile: true }
    });
    
    if (!tutor) {
      console.log("No tutor found in DB");
      return;
    }
    
    console.log("Found tutor:", tutor.name, tutor.id);
    console.log("Current Profile:", tutor.tutorProfile);
    
    const payload = {
      bio: "TEST BIO UPDATED " + Date.now(),
      headline: "TEST HEADLINE UPDATED",
      hourlyRate: 99
    };
    
    const updated = await prisma.tutorProfile.upsert({
      where: { userId: tutor.id },
      update: payload,
      create: {
        userId: tutor.id,
        ...payload
      }
    });
    
    console.log("Updated Profile:", updated);
    
    const check = await prisma.tutorProfile.findUnique({ where: { userId: tutor.id } });
    console.log("Verify update:", check.bio.includes("TEST BIO UPDATED") ? "SUCCESS" : "FAILED");

  } catch (err) {
    console.error("Error in test:", err);
  } finally {
    process.exit();
  }
}

testUpdate();
