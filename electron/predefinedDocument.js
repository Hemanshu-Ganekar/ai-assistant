// Predefined single document for the demo
// This document is preloaded and requires no file upload

const PREDEFINED_DOCUMENT = {
  name: 'Unit 1: Fundamentals of Physics & Chemistry',
  filePath: '__PREDEFINED__',
  content: `
    UNIT 1: FUNDAMENTALS OF PHYSICS AND CHEMISTRY
    
    Chapter 1: Motion and Forces
    
    1.1 Basic Concepts of Motion
    Motion is the change in position of an object with respect to time. 
    Displacement is the shortest distance between initial and final positions.
    Speed is the distance traveled per unit time.
    Velocity is the displacement per unit time and has direction.
    Acceleration is the change in velocity per unit time.
    
    1.2 Newton's Laws of Motion
    First Law: An object at rest stays at rest, and an object in motion stays in motion unless acted upon by a force.
    Second Law: Force equals mass times acceleration (F = ma).
    Third Law: For every action, there is an equal and opposite reaction.
    
    1.3 Types of Forces
    Gravitational force pulls objects toward the Earth's center with magnitude F = mg, where g = 9.8 m/s².
    Friction is a force that opposes motion between surfaces in contact.
    Normal force is the force perpendicular to a surface.
    Tension is the force transmitted through a rope or cable.
    
    Chapter 2: Energy and Work
    
    2.1 Work and Energy
    Work is done when a force causes displacement: W = F × d × cos(θ).
    Kinetic energy is the energy of motion: KE = ½mv².
    Potential energy is stored energy: PE = mgh (gravitational).
    Energy is conserved in isolated systems.
    
    2.2 Power
    Power is the rate of doing work: P = W/t.
    Power is measured in watts (W), where 1 watt = 1 joule per second.
    
    Chapter 3: Atomic Structure
    
    3.1 Atoms and Subatomic Particles
    An atom consists of electrons orbiting a nucleus.
    The nucleus contains protons (positive charge) and neutrons (neutral).
    Electrons (negative charge) occupy electron shells.
    The atomic number equals the number of protons.
    The mass number equals protons plus neutrons.
    
    3.2 Electron Configuration
    Electrons fill orbitals in order of increasing energy.
    The first shell holds maximum 2 electrons.
    The second shell holds maximum 8 electrons.
    The third shell holds maximum 18 electrons.
    
    3.3 Chemical Bonding
    Ionic bonds form between metals and nonmetals through electron transfer.
    Covalent bonds form between nonmetals through electron sharing.
    Metallic bonds form between metal atoms.
    Hydrogen bonds are weak interactions between polar molecules.
    
    Chapter 4: Chemical Reactions
    
    4.1 Types of Chemical Reactions
    Synthesis: Two substances combine to form one (A + B → AB).
    Decomposition: One substance breaks into two (AB → A + B).
    Single displacement: An element replaces another (A + BC → AC + B).
    Double displacement: Ions exchange partners (AB + CD → AD + CB).
    Combustion: A substance reacts with oxygen releasing energy.
    
    4.2 Balancing Chemical Equations
    Equations must have equal atoms of each element on both sides.
    Start with the most complex substance.
    Adjust coefficients, not subscripts.
    Check the balance by counting atoms.
    
    4.3 Stoichiometry
    Stoichiometry relates quantities in chemical reactions.
    The mole is the unit for amount of substance (6.022 × 10²³ particles).
    Molar mass is the mass of one mole of a substance.
    Calculations use mole ratios from balanced equations.
    
    Chapter 5: The Periodic Table
    
    5.1 Organization of the Periodic Table
    Elements are arranged by atomic number (protons).
    Rows are called periods.
    Columns are called groups or families with similar properties.
    
    5.2 Periodic Trends
    Atomic radius increases down a group.
    Atomic radius decreases across a period.
    Ionization energy increases across a period.
    Ionization energy decreases down a group.
    Electronegativity measures atom's tendency to attract electrons.
    
    5.3 Element Categories
    Alkali metals are highly reactive (Group 1).
    Alkaline earth metals are moderately reactive (Group 2).
    Halogens are highly reactive nonmetals (Group 17).
    Noble gases are unreactive (Group 18).
    Transition metals have variable oxidation states.
  `,
}

// Chunks of the predefined document
const PREDEFINED_CHUNKS = [
  {
    text: 'Motion is the change in position of an object with respect to time. Displacement is the shortest distance between initial and final positions. Speed is the distance traveled per unit time. Velocity is the displacement per unit time and has direction. Acceleration is the change in velocity per unit time.',
    section: '1.1 Basic Concepts of Motion',
  },
  {
    text: 'First Law: An object at rest stays at rest, and an object in motion stays in motion unless acted upon by a force. Second Law: Force equals mass times acceleration (F = ma). Third Law: For every action, there is an equal and opposite reaction.',
    section: '1.2 Newton\'s Laws of Motion',
  },
  {
    text: 'Gravitational force pulls objects toward the Earth\'s center with magnitude F = mg, where g = 9.8 m/s². Friction is a force that opposes motion between surfaces in contact. Normal force is the force perpendicular to a surface. Tension is the force transmitted through a rope or cable.',
    section: '1.3 Types of Forces',
  },
  {
    text: 'Work is done when a force causes displacement: W = F × d × cos(θ). Kinetic energy is the energy of motion: KE = ½mv². Potential energy is stored energy: PE = mgh (gravitational). Energy is conserved in isolated systems.',
    section: '2.1 Work and Energy',
  },
  {
    text: 'Power is the rate of doing work: P = W/t. Power is measured in watts (W), where 1 watt = 1 joule per second.',
    section: '2.2 Power',
  },
  {
    text: 'An atom consists of electrons orbiting a nucleus. The nucleus contains protons (positive charge) and neutrons (neutral). Electrons (negative charge) occupy electron shells. The atomic number equals the number of protons. The mass number equals protons plus neutrons.',
    section: '3.1 Atoms and Subatomic Particles',
  },
  {
    text: 'Electrons fill orbitals in order of increasing energy. The first shell holds maximum 2 electrons. The second shell holds maximum 8 electrons. The third shell holds maximum 18 electrons.',
    section: '3.2 Electron Configuration',
  },
  {
    text: 'Ionic bonds form between metals and nonmetals through electron transfer. Covalent bonds form between nonmetals through electron sharing. Metallic bonds form between metal atoms. Hydrogen bonds are weak interactions between polar molecules.',
    section: '3.3 Chemical Bonding',
  },
  {
    text: 'Synthesis: Two substances combine to form one (A + B → AB). Decomposition: One substance breaks into two (AB → A + B). Single displacement: An element replaces another (A + BC → AC + B). Double displacement: Ions exchange partners (AB + CD → AD + CB). Combustion: A substance reacts with oxygen releasing energy.',
    section: '4.1 Types of Chemical Reactions',
  },
  {
    text: 'Equations must have equal atoms of each element on both sides. Start with the most complex substance. Adjust coefficients, not subscripts. Check the balance by counting atoms.',
    section: '4.2 Balancing Chemical Equations',
  },
  {
    text: 'Stoichiometry relates quantities in chemical reactions. The mole is the unit for amount of substance (6.022 × 10²³ particles). Molar mass is the mass of one mole of a substance. Calculations use mole ratios from balanced equations.',
    section: '4.3 Stoichiometry',
  },
  {
    text: 'Elements are arranged by atomic number (protons). Rows are called periods. Columns are called groups or families with similar properties.',
    section: '5.1 Organization of the Periodic Table',
  },
  {
    text: 'Atomic radius increases down a group. Atomic radius decreases across a period. Ionization energy increases across a period. Ionization energy decreases down a group. Electronegativity measures atom\'s tendency to attract electrons.',
    section: '5.2 Periodic Trends',
  },
  {
    text: 'Alkali metals are highly reactive (Group 1). Alkaline earth metals are moderately reactive (Group 2). Halogens are highly reactive nonmetals (Group 17). Noble gases are unreactive (Group 18). Transition metals have variable oxidation states.',
    section: '5.3 Element Categories',
  },
]

module.exports = {
  PREDEFINED_DOCUMENT,
  PREDEFINED_CHUNKS,
}
