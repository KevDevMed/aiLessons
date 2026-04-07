import { create } from 'zustand';

export interface TrashItem {
  id: string;
  name: string;
  icon: string;
  type: 'app' | 'file';
  deletedAt: string;
  originalLocation: string;
  size: string;
  appId?: string;
  ext?: string;
  fileContent?: string;
}

interface TrashStore {
  items: TrashItem[];
  restoredItems: TrashItem[];
  addItem: (item: TrashItem) => void;
  removeItem: (id: string) => void;
  emptyTrash: () => void;
  restoreItem: (id: string) => void;
}

const funnyDefaults: TrashItem[] = [
  {
    id: 'trash-1',
    name: 'my_feelings.txt',
    icon: '📄',
    type: 'file',
    ext: 'txt',
    deletedAt: '3/15/2026 2:33 AM',
    originalLocation: 'C:\\Users\\Me\\Desktop',
    size: '0 KB',
    fileContent: '',
  },
  {
    id: 'trash-2',
    name: 'diet_plan_v47_FINAL_real.docx',
    icon: '📘',
    type: 'file',
    ext: 'docx',
    deletedAt: '1/2/2026 12:01 AM',
    originalLocation: 'C:\\Users\\Me\\Documents',
    size: '2 KB',
    fileContent: '[Word Document — diet_plan_v47_FINAL_real.docx]\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nDIET PLAN v47 (THIS IS THE ONE)\n\nMonday:\n  Breakfast: Kale smoothie\n  Lunch: Grilled chicken salad\n  Dinner: Steamed vegetables\n\nTuesday:\n  Breakfast: See Monday\n  Lunch: Actually maybe pizza is fine\n  Dinner: Pizza (it has vegetables on it)\n\nWednesday:\n  Breakfast: Leftover pizza\n  Lunch: Pizza again (I bought too much)\n  Dinner: Starting over on Monday\n\nNote to self: v48 will be the real one.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nPages: 1  |  Size: 2 KB',
  },
  {
    id: 'trash-3',
    name: 'New Folder (37)',
    icon: '📁',
    type: 'file',
    ext: undefined,
    deletedAt: '4/1/2026 4:20 PM',
    originalLocation: 'C:\\Users\\Me\\Desktop',
    size: '0 KB',
    fileContent: undefined,
  },
  {
    id: 'trash-4',
    name: 'passwords_DO_NOT_DELETE.txt',
    icon: '📄',
    type: 'file',
    ext: 'txt',
    deletedAt: '2/14/2026 11:59 PM',
    originalLocation: 'C:\\Users\\Me\\Desktop',
    size: '1 KB',
    fileContent: '=== SUPER SECRET PASSWORDS ===\n\nEmail: password123\nBank: also_password123\nNetflix: borrowed_from_mom\nWifi: its written on the fridge\nLuggage combination: 1-2-3-4-5\nPhone PIN: 0000 (the default one)\nWork laptop: same as email but with !\nCrypto wallet: I forgot this one. Oops.\n\nNote: I should really use a password manager.\nNote 2: The password manager password is password123.',
  },
  {
    id: 'trash-5',
    name: 'ex_photos',
    icon: '📁',
    type: 'file',
    ext: undefined,
    deletedAt: '2/15/2026 12:03 AM',
    originalLocation: 'C:\\Users\\Me\\Pictures',
    size: '4.2 GB',
    fileContent: undefined,
  },
  {
    id: 'trash-6',
    name: 'homework (definitely not games)',
    icon: '📁',
    type: 'file',
    ext: undefined,
    deletedAt: '12/25/2025 9:00 AM',
    originalLocation: 'C:\\Users\\Me\\Documents',
    size: '87.3 GB',
    fileContent: undefined,
  },
  {
    id: 'trash-7',
    name: 'startup_idea_uber_for_dogs.pptx',
    icon: '📊',
    type: 'file',
    ext: 'pptx',
    deletedAt: '3/28/2026 3:14 PM',
    originalLocation: 'C:\\Users\\Me\\Documents\\Work',
    size: '15 MB',
    fileContent: '[PowerPoint — startup_idea_uber_for_dogs.pptx]\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nSlide 1: UBER FOR DOGS\n  "Because dogs deserve rides too"\n\nSlide 2: THE PROBLEM\n  Dogs can\'t drive. This is a $4 trillion problem.\n\nSlide 3: THE SOLUTION\n  An app where dogs request rides to the park.\n  (Owner pays, obviously. Dogs don\'t have wallets.)\n\nSlide 4: REVENUE MODEL\n  - Premium: Dog gets the front seat\n  - Enterprise: Dog gets the whole car\n  - Treat Surge Pricing\n\nSlide 5: COMPETITION\n  None. Because this is a terrible idea.\n  Wait, delete this slide before the pitch.\n\nSlide 6: FUNDING ASK\n  $50 million seed round\n  (My dog needs a very nice car)\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nSlides: 6  |  Size: 15 MB',
  },
  {
    id: 'trash-8',
    name: 'todo_list_2019.txt',
    icon: '📄',
    type: 'file',
    ext: 'txt',
    deletedAt: '4/5/2026 10:00 AM',
    originalLocation: 'C:\\Users\\Me\\Documents',
    size: '856 KB',
    fileContent: '=== TODO LIST 2019 ===\n\n[ ] Learn to cook\n[ ] Go to the gym (for real this time)\n[ ] Read 52 books\n[ ] Learn a new language\n[ ] Start a blog\n[ ] Clean the garage\n[ ] Call grandma more often\n[ ] Learn to play guitar\n[ ] Wake up at 5 AM every day\n[ ] Meditate daily\n[ ] Drink more water\n[ ] Less screen time\n\n=== 2019 FINAL STATUS ===\n\n[✓] Made this list\n\nCarried forward to: 2020, 2021, 2022, 2023, 2024, 2025, 2026\nCurrent status: Still on the list.',
  },
  {
    id: 'trash-9',
    name: 'virus_free_movie_download.exe',
    icon: '⚙️',
    type: 'file',
    ext: 'exe',
    deletedAt: '11/3/2025 2:00 AM',
    originalLocation: 'C:\\Users\\Me\\Downloads',
    size: '42 KB',
    fileContent: '⚠️ WARNING ⚠️\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nThis application cannot be opened.\n\nWindows Defender flagged this file with\n47 different threat detections.\n\nOriginal filename: totally_not_a_virus.exe\nPublisher: Unknown\nDigital Signature: LOL no\nDownloaded from: fr33-m0vi3z-2025.biz\n\nRecommendation: What were you thinking?\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
  },
  {
    id: 'trash-10',
    name: 'resignation_letter_draft_3.docx',
    icon: '📘',
    type: 'file',
    ext: 'docx',
    deletedAt: '3/31/2026 5:01 PM',
    originalLocation: 'C:\\Users\\Me\\Documents\\Work',
    size: '8 KB',
    fileContent: '[Word Document — resignation_letter_draft_3.docx]\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nDraft 1 (crossed out):\n  "I quit. Effective immediately. Goodbye."\n\nDraft 2 (crossed out):\n  "Dear Boss, It\'s not you, it\'s me.\n   Actually it\'s you. Peace out."\n\nDraft 3 (current):\n  "Dear [Boss Name - look this up],\n\n   After much careful consideration and\n   definitely not because of the incident\n   with the microwave in the break room,\n   I have decided to pursue other\n   opportunities.\n\n   I will remember my time here fondly,\n   except for the parking situation.\n\n   Please accept this letter as formal\n   notice of my resignation, effective\n   [date - figure out later].\n\n   Sincerely,\n   [My name - make sure to fill this in]"\n\nNote: Maybe just stay. The job market\nis rough out there.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nPages: 1  |  Size: 8 KB',
  },
];

export const useTrashStore = create<TrashStore>((set) => ({
  items: [...funnyDefaults],
  restoredItems: [],

  addItem: (item) =>
    set((state) => ({
      items: [item, ...state.items],
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),

  emptyTrash: () => set({ items: [] }),

  restoreItem: (id) =>
    set((state) => {
      const item = state.items.find((i) => i.id === id);
      return {
        items: state.items.filter((i) => i.id !== id),
        restoredItems: item ? [...state.restoredItems, item] : state.restoredItems,
      };
    }),
}));
