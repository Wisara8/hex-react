const commonScenarios = [
  {
    id: "scenario_001",
    scenario: "An overgrown sign post lies on the side of the trail you are following.",
    options: [
      {
        text: "Clean it off and follow one of the markers.",
        tag: "R",
        optionOutcomes: [
          {
            text: "Follow the trail to find a patch of 1d4 edible flowers. They are identical to normal flower resources but your character can choose to eat. This grants no bonuses."
          },
          {
            text: "A meadow of 1d4 tree bark"
          },
          {
            text: "A puddle of magic essence worth 1 resource that can be sponged up."
          }
        ]
      },
      {
        text: "Take a really close look at the sign post. What’s its angle here? Is it a trick? A puzzle?",
        tag: "C",
        optionOutcomes: [
          {
            text: "You thoroughly wasted your time on a sign covered in vines. You must now search within yourself to ascertain why you were so disturbed by a fallen over sign."
          },
          {
            text: "It is a puzzle! Placed upright and reading the direction markers out loud and counter clockwise unlocks a secret compartment near the base of the post. You find a clue, smart guy!"
          }
        ]
      },
      {
        text: "If you have a muddled mind you are able to speak with the sign to gain 1 clue token and 1 resource of your choosing.",
        tag: "Conditional",
        optionOutcomes: [
          {
            text: "Gain 1 clue token and 1 resource of your choosing."
          }
        ]
      }
    ]
  },

  {
    id: "scenario_002",
    scenario: "A gentle spiral of enchanted leaves dances above the forest floor, stirring the air and imbuing it with strange energy. You feel a tug on your senses urging you to interact.",
    options: [
      {
        text: "Tame the wind with your voice.",
        tag: "B, CB",
        optionOutcomes: [
          {
            text: "It goes about as well as petting a tornado could have, you are injured."
          },
          {
            text: "You breathe deep and store the wind’s power for later. Search for and take the Tame the Wind boon."
          }
        ]
      },
      {
        text: "Take out an empty bottle containing a packet of salt and spritz of vinegar and attempt to pickle the wind.",
        tag: "M, I",
        optionOutcomes: [
          {
            text: "This wind eludes your sodium traps and pushes your character backwards by one hex. Draw a shenanigan."
          },
          {
            text: "Success! Just like back in your homeland, a jar of pickled wind can be used as a healing potion."
          }
        ]
      },
      {
        text: "Grab the nearest, largest, and girthiest leaves and leap off a modest cliff to ride the wind.",
        tag: "M, F",
        optionOutcomes: [
          {
            text: "Your flight takes you above toasty thermals propelling you upwards and granting an excellent view of the surroundings. Gain a clue and your next encounter will be a rare encounter."
          },
          {
            text: "Your flight is obnoxiously poetic. It disturbs the Forest causing a shift in its mood to anger."
          }
        ]
      }
    ]
  },

  {
    id: "scenario_003",
    scenario: "Your gander gleams a gangly gnarled tree teleporting away anything that approaches it.",
    options: [
      {
        text: "Approach the tree cautiously.",
        tag: "M, CB",
        optionOutcomes: [
          {
            text: "Its gnarled knots grind and groan and the tree decides to send you to an identical home. You are teleported to an identical gnarled tree somewhere else on the map."
          },
          {
            text: "The twisted trunk tightens and turns. It teleports you away wearing nothing but ferns. You are teleported to an identical gnarled tree somewhere else on the map but arrive naked and afraid."
          }
        ]
      },
      {
        text: "Back away slowly and avoid the area.",
        tag: "I, CB",
        optionOutcomes: [
          {
            text: "You back up into a pile of clothes. Add spare clothing to your inventory."
          },
          {
            text: "Snapping twigs startle the gangly tree. Teleport any character within 10 hexes of it 1 hex backwards and naked and afraid."
          }
        ]
      },
      {
        text: "Try talking to it.",
        tag: "C, M",
        optionOutcomes: [
          {
            text: "The tree rumbles revealing responses. Gain a clue after a pleasant afternoon chat."
          },
          {
            text: "The tree is intrigued and invested in your quest. It offers to teleport one resource from any player within 10 hexes to your camp."
          }
        ]
      }
    ]
  },

  {
    id: "scenario_004",
    scenario: "The remains of an abandoned camp lies at the edge of a meadow. The owners appear to be long gone (i.e. guilt free loot for the taking).",
    options: [
      {
        text: "Search the camp.",
        tag: "Free Choice",
        optionOutcomes: [
          { text: "Find a resource." },
          { text: "Find a healing potion." },
          { text: "Find a clue." },
          { text: "Find a monster lure." },
          { text: "Find an artifact containing a magical shenanigan." },
          { text: "Choose one of the above." }
        ]
      }
    ]
  },

  {
    id: "scenario_005",
    scenario: "Sinister thieving vines sneak up on you. You catch a glimpse of them coiled and ready to strike just in time to…",
    options: [
      {
        text: "Run away Ahhhh…!!!",
        tag: "S, R, I",
        optionOutcomes: [
          {
            text: "Your calm and dignified sprint to safety leads you to a patch of wisecracking glowing cabbages. Draw a shenanigan."
          },
          {
            text: "You escape but not before the vines steal 1 resource or item of your choosing."
          }
        ]
      },
      {
        text: "Slice and dice them!",
        tag: "F, R, I",
        optionOutcomes: [
          {
            text: "The vines retreat but the forest mood becomes ornery."
          },
          {
            text: "Your counter assault mostly works but it leaves you open to a counter counter assault! The vines steal a total of 2 resources or items."
          }
        ]
      },
      {
        text: "Remain perfectly still, vines hunt by movement.",
        tag: "I, CB",
        optionOutcomes: [
          {
            text: "They do not hunt by movement, who told you that? They steal everything you are carrying leaving you naked and afraid."
          }
        ]
      }
    ]
  }
];

const rareScenarios = [
  {
    id: "rare_scenario_001",
    scenario: "Friendly centaur approaches offering to impart the lore of the land to those who would listen.",
    options: [
      {
        text: "Listen to the centaur’s tales.",
        tag: "CL, B",
        optionOutcomes: [
          {
            text: "The centaur knows much, draw 2 clues."
          },
          {
            text: "The centaur tells a long rambly tale that seems to have no meaning. You misinterpret many things and his directions lead you to a bane."
          }
        ]
      },
      {
        text: "Ride the centaur.",
        tag: "CB, S",
        optionOutcomes: [
          {
            text: "This was a bad idea. He bucks you off and stomps on you repeatedly. You are mangled."
          },
          {
            text: "It goes smoother than any onlooker would have guessed. The centaur is furious and will offer you 1 shenanigan to get off."
          }
        ]
      },
      {
        text: "Kill and eat the centaur.",
        tag: "C, F, R",
        optionOutcomes: [
          {
            text: "The centaur sees the wild and deranged look in your eyes and flees. The Forest mood changes to ornery."
          },
          {
            text: "The centaur sees the wild and deranged look in your eyes but it’s too late. You’ve already torn its nutritious heart out. Centaur meat and organs count as 1 magic essence, 1 tree bark, and 1 flower. Draw one curse."
          }
        ]
      }
    ]
  },

  {
    id: "rare_scenario_002",
    scenario: "You come across a suspended ball of bones held together with sweet smelling tree sap and coagulated blood.",
    options: [
      {
        text: "Investigate cautiously.",
        tag: "I, CB",
        optionOutcomes: [
          {
            text: "Find an old monster trap you can add to your inventory."
          },
          {
            text: "You dabbled with forces beyond your comprehension: lost in time and space."
          }
        ]
      },
      {
        text: "Cool… I’m leaving though.",
        tag: "F, MO",
        optionOutcomes: [
          {
            text: "You run into a random monster as you back away. Begin a chase!"
          }
        ]
      },
      {
        text: "Kick the ball of bones as hard as you can.",
        tag: "F",
        optionOutcomes: [
          {
            text: "A shenanigan falls out as it’s blasted to the nearest player. They receive the encounter and play it immediately. If the ball is kicked three times, it explodes: on 1–2 all players gain banes, on 3–4 all players gain boons."
          },
          {
            text: "The forest is irked that this thing still exists. Forest mood becomes angry."
          }
        ]
      },
      {
        text: "Burn it.",
        tag: "F, B, M",
        optionOutcomes: [
          {
            text: "The forest thanks you. Gain the Druidic Boon."
          },
          {
            text: "The forest rests easier with this abomination gone. Forest mood becomes bountiful."
          }
        ]
      }
    ]
  },

  {
    id: "rare_scenario_003",
    scenario: "The melody of singing mushrooms invades your mind.",
    options: [
      {
        text: "Dance with them.",
        tag: "B, CB",
        optionOutcomes: [
          {
            text: "Gain a movement boon (mushroom boots)."
          },
          {
            text: "Your rhythm is so far off you mangle your body trying to find the beat."
          }
        ]
      },
      {
        text: "Sing with them.",
        tag: "I, F",
        optionOutcomes: [
          {
            text: "The song ends and the mushrooms become a monster scare."
          },
          {
            text: "The mushrooms scream, irking all monsters. Forest mood becomes ornery."
          }
        ]
      },
      {
        text: "Eat them.",
        tag: "M, CB",
        optionOutcomes: [
          {
            text: "You grow to 10x your size and gain the naked and overconfident boon."
          },
          {
            text: "You are petrified… womp womp."
          }
        ]
      },
      {
        text: "Stomp on them.",
        tag: "R, CB",
        optionOutcomes: [
          {
            text: "Turn into a random resource."
          },
          {
            text: "They spray a powder that petrifies you."
          }
        ]
      }
    ]
  },

  {
    id: "rare_scenario_004",
    scenario: "Monster! — You come upon a monster. Draw a random monster not on the board.",
    options: [
      {
        text: "Attempt to sneak by.",
        tag: "Stealth",
        optionOutcomes: [
          {
            text: "Fail — start a monster chase."
          },
          {
            text: "Succeed. You get by it with no reward."
          }
        ]
      },
      {
        text: "Plant a trap (only possible if you have a trap).",
        tag: "Trap",
        optionOutcomes: [
          {
            text: "Consumes trap. Monster is captured."
          }
        ]
      },
      {
        text: "Ambush the monster with the element of surprise and two angry fists!",
        tag: "F",
        optionOutcomes: [
          {
            text: "Terrible idea. You’re instantly caught."
          }
        ]
      }
    ]
  },

  {
    id: "rare_scenario_005",
    scenario: "Treasure! You spy a hidden treasure chest tucked into the canopy.",
    options: [
      {
        text: "Open the chest.",
        tag: "I, B, S, C",
        optionOutcomes: [
          {
            text: "Draw a random item, boon, or shenanigan."
          },
          {
            text: "It’s a mimic. Receive a curse."
          }
        ]
      },
      {
        text: "Destroy the chest from afar.",
        tag: "I",
        optionOutcomes: [
          {
            text: "The burning wreckage of nice items, boons, and shenanigans litters the area. You get nothing, but the explosion was neat."
          },
          {
            text: "You’ve killed a mimic. You can use its dead carcass as a monster flare."
          }
        ]
      }
    ]
  }
];
export { commonScenarios, rareScenarios };