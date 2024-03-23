// https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws?player=X

export interface OSRSActivityData {
    rank: number;
    level: number;
    xp: number;
}

export const OSRSSkills = [
    'Overall',
    'Attack',
    'Defence',
    'Strength',
    'Hitpoints',
    'Ranged',
    'Prayer',
    'Magic',
    'Cooking',
    'Woodcutting',
    'Fletching',
    'Fishing',
    'Firemaking',
    'Crafting',
    'Smithing',
    'Mining',
    'Herblore',
    'Agility',
    'Thieving',
    'Slayer',
    'Farming',
    'Runecrafting',
    'Hunter',
    'Construction'
];

export const OSRSActivities = [
    'League Points',
    'Deadman Points',
    'Bounty Hunter - Hunter',
    'Bounty Hunter - Rogue',
    'Bounty Hunter(Legacy) - Hunter',
    'Bounty Hunter(Legacy) - Rogue',
    'Clue Scrolls(all)',
    'Clue Scrolls(beginner)',
    'Clue Scrolls(easy)',
    'Clue Scrolls(medium)',
    'Clue Scrolls(hard)',
    'Clue Scrolls(elite)',
    'Clue Scrolls(master)',
    'LMS - Rank',
    'PvP Arena - Rank',
    'Soul Wars Zeal',
    'Rifts closed',
    'Colosseum Glory',
    'Abyssal Sire',
    'Alchemical Hydra',
    'Artio',
    'Barrows Chests',
    'Bryophyta',
    'Callisto',
    'Cal\'varion',
    'Cerberus',
    'Chambers of Xeric',
    'Chambers of Xeric: Challenge Mode',
    'Chaos Elemental',
    'Chaos Fanatic',
    'Commander Zilyana',
    'Corporeal Beast',
    'Crazy Archaeologist',
    'Dagannoth Prime',
    'Dagannoth Rex',
    'Dagannoth Supreme',
    'Deranged Archaeologist',
    'Duke Sucellus',
    'General Graardor',
    'Giant Mole',
    'Grotesque Guardians',
    'Hespori',
    'Kalphite Queen',
    'King Black Dragon',
    'Kraken',
    'Kree\'Arra',
    'K\'ril Tsutsaroth',
    'Lunar Chests',
    'Mimic',
    'Nex',
    'Nightmare',
    'Phosani\'s Nightmare',
    'Obor',
    'Phantom Muspah',
    'Sarachnis',
    'Scorpia',
    'Scurrius',
    'Skotizo',
    'Sol Heredit',
    'Spindel',
    'Tempoross',
    'The Gauntlet',
    'The Corrupted Gauntlet',
    'The Leviathan',
    'The Whisperer',
    'Theatre of Blood',
    'Theatre of Blood: Hard Mode',
    'Thermonuclear Smoke Devil',
    'Tombs of Amascut',
    'Tombs of Amascut: Expert Mode',
    'TzKal - Zuk',
    'TzTok - Jad',
    'Vardorvis',
    'Venenatis',
    'Vet\'ion',
    'Vorkath',
    'Wintertodt',
    'Zalcano',
    'Zulrah',
];

export interface HighscorePlayer {
    skills: { [key: string]: OSRSActivityData };
    activities: { [key: string]: OSRSActivityData };
}

export async function getHighscores(player: string): Promise<HighscorePlayer> {
    const res = await fetch(`https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws?player=${player}`);
    const text = await res.text();
    const lines = text.split('\n');
    const skills: { [key: string]: OSRSActivityData } = {} as any;
    const activities: { [key: string]: OSRSActivityData } = {} as any;

    for (let i = 0; i < OSRSSkills.length; i++) {
        const [rank, level, xp] = lines[i].split(',');
        skills[OSRSSkills[i]] = { rank: parseInt(rank), level: parseInt(level), xp: parseInt(xp) };
    }

    for (let i = 0; i < OSRSActivities.length; i++) {
        const [rank, score] = lines[i + OSRSSkills.length].split(',');
        let xp = parseInt(score);
        if (xp < 0) xp = 0;
        activities[OSRSActivities[i].toLowerCase()] = { rank: parseInt(rank), level: 0, xp };
    }

    return { skills, activities };
}