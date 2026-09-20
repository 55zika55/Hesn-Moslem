import { SurahMeta, AyahItem } from '../types';

export const ALL_SURAHS: SurahMeta[] = [
  { number: 1, name: 'الفَاتِحَة', englishName: 'Al-Faatiha', englishNameTranslation: 'The Opening', numberOfAyahs: 7, revelationType: 'Meccan', juz: 1, page: 1 },
  { number: 2, name: 'البَقَرَة', englishName: 'Al-Baqarah', englishNameTranslation: 'The Cow', numberOfAyahs: 286, revelationType: 'Medinan', juz: 1, page: 2 },
  { number: 3, name: 'آل عِمْرَان', englishName: 'Aal-i-Imraan', englishNameTranslation: 'The Family of Imraan', numberOfAyahs: 200, revelationType: 'Medinan', juz: 3, page: 50 },
  { number: 4, name: 'النِّسَاء', englishName: 'An-Nisaa', englishNameTranslation: 'The Women', numberOfAyahs: 176, revelationType: 'Medinan', juz: 4, page: 77 },
  { number: 5, name: 'المَائِدَة', englishName: 'Al-Maaida', englishNameTranslation: 'The Table Spread', numberOfAyahs: 120, revelationType: 'Medinan', juz: 6, page: 106 },
  { number: 6, name: 'الأَنْعَام', englishName: 'Al-An\'aam', englishNameTranslation: 'The Cattle', numberOfAyahs: 165, revelationType: 'Meccan', juz: 7, page: 128 },
  { number: 7, name: 'الأَعْرَاف', englishName: 'Al-A\'raaf', englishNameTranslation: 'The Heights', numberOfAyahs: 206, revelationType: 'Meccan', juz: 8, page: 151 },
  { number: 8, name: 'الأَنْفَال', englishName: 'Al-Anfaal', englishNameTranslation: 'The Spoils of War', numberOfAyahs: 75, revelationType: 'Medinan', juz: 9, page: 177 },
  { number: 9, name: 'التَّوْبَة', englishName: 'At-Tawba', englishNameTranslation: 'The Repentance', numberOfAyahs: 129, revelationType: 'Medinan', juz: 10, page: 187 },
  { number: 10, name: 'يُونُس', englishName: 'Yunus', englishNameTranslation: 'Jonah', numberOfAyahs: 109, revelationType: 'Meccan', juz: 11, page: 208 },
  { number: 11, name: 'هُود', englishName: 'Hud', englishNameTranslation: 'Hud', numberOfAyahs: 123, revelationType: 'Meccan', juz: 11, page: 221 },
  { number: 12, name: 'يُوسُف', englishName: 'Yusuf', englishNameTranslation: 'Joseph', numberOfAyahs: 111, revelationType: 'Meccan', juz: 12, page: 235 },
  { number: 13, name: 'الرَّعْد', englishName: 'Ar-Ra\'d', englishNameTranslation: 'The Thunder', numberOfAyahs: 43, revelationType: 'Medinan', juz: 13, page: 249 },
  { number: 14, name: 'إِبْرَاهِيم', englishName: 'Ibrahim', englishNameTranslation: 'Abraham', numberOfAyahs: 52, revelationType: 'Meccan', juz: 13, page: 255 },
  { number: 15, name: 'الحِجْر', englishName: 'Al-Hijr', englishNameTranslation: 'The Rocky Tract', numberOfAyahs: 99, revelationType: 'Meccan', juz: 14, page: 262 },
  { number: 16, name: 'النَّحْل', englishName: 'An-Nahl', englishNameTranslation: 'The Bee', numberOfAyahs: 128, revelationType: 'Meccan', juz: 14, page: 267 },
  { number: 17, name: 'الإِسْرَاء', englishName: 'Al-Israa', englishNameTranslation: 'The Night Journey', numberOfAyahs: 111, revelationType: 'Meccan', juz: 15, page: 282 },
  { number: 18, name: 'الكَهْف', englishName: 'Al-Kahf', englishNameTranslation: 'The Cave', numberOfAyahs: 110, revelationType: 'Meccan', juz: 15, page: 293 },
  { number: 19, name: 'مَرْيَم', englishName: 'Maryam', englishNameTranslation: 'Mary', numberOfAyahs: 98, revelationType: 'Meccan', juz: 16, page: 305 },
  { number: 20, name: 'طه', englishName: 'Taa-Haa', englishNameTranslation: 'Ta-Ha', numberOfAyahs: 135, revelationType: 'Meccan', juz: 16, page: 312 },
  { number: 21, name: 'الأَنْبِيَاء', englishName: 'Al-Anbiyaa', englishNameTranslation: 'The Prophets', numberOfAyahs: 112, revelationType: 'Meccan', juz: 17, page: 322 },
  { number: 22, name: 'الحَجّ', englishName: 'Al-Hajj', englishNameTranslation: 'The Pilgrimage', numberOfAyahs: 78, revelationType: 'Medinan', juz: 17, page: 332 },
  { number: 23, name: 'المُؤْمِنُون', englishName: 'Al-Mu\'minoon', englishNameTranslation: 'The Believers', numberOfAyahs: 118, revelationType: 'Meccan', juz: 18, page: 342 },
  { number: 24, name: 'النُّور', englishName: 'An-Noor', englishNameTranslation: 'The Light', numberOfAyahs: 64, revelationType: 'Medinan', juz: 18, page: 350 },
  { number: 25, name: 'الفُرْقَان', englishName: 'Al-Furqaan', englishNameTranslation: 'The Criterion', numberOfAyahs: 77, revelationType: 'Meccan', juz: 18, page: 359 },
  { number: 26, name: 'الشُّعَرَاء', englishName: 'Ash-Shu\'araa', englishNameTranslation: 'The Poets', numberOfAyahs: 227, revelationType: 'Meccan', juz: 19, page: 367 },
  { number: 27, name: 'النَّمْل', englishName: 'An-Naml', englishNameTranslation: 'The Ant', numberOfAyahs: 93, revelationType: 'Meccan', juz: 19, page: 377 },
  { number: 28, name: 'القَصَص', englishName: 'Al-Qasas', englishNameTranslation: 'The Stories', numberOfAyahs: 88, revelationType: 'Meccan', juz: 20, page: 385 },
  { number: 29, name: 'العَنْكَبُوت', englishName: 'Al-Ankaboot', englishNameTranslation: 'The Spider', numberOfAyahs: 69, revelationType: 'Meccan', juz: 20, page: 396 },
  { number: 30, name: 'الرُّوم', englishName: 'Ar-Room', englishNameTranslation: 'The Romans', numberOfAyahs: 60, revelationType: 'Meccan', juz: 21, page: 404 },
  { number: 31, name: 'لُقْمَان', englishName: 'Luqman', englishNameTranslation: 'Luqman', numberOfAyahs: 34, revelationType: 'Meccan', juz: 21, page: 411 },
  { number: 32, name: 'السَّجْدَة', englishName: 'As-Sajda', englishNameTranslation: 'The Prostration', numberOfAyahs: 30, revelationType: 'Meccan', juz: 21, page: 415 },
  { number: 33, name: 'الأَحْزَاب', englishName: 'Al-Ahzaab', englishNameTranslation: 'The Clans', numberOfAyahs: 73, revelationType: 'Medinan', juz: 21, page: 418 },
  { number: 34, name: 'سَبَإ', englishName: 'Saba', englishNameTranslation: 'Sheba', numberOfAyahs: 54, revelationType: 'Meccan', juz: 22, page: 428 },
  { number: 35, name: 'فَاطِر', englishName: 'Faatir', englishNameTranslation: 'The Originator', numberOfAyahs: 45, revelationType: 'Meccan', juz: 22, page: 434 },
  { number: 36, name: 'يس', englishName: 'Yaseen', englishNameTranslation: 'Ya-Sin', numberOfAyahs: 83, revelationType: 'Meccan', juz: 22, page: 440 },
  { number: 37, name: 'الصَّافَّات', englishName: 'As-Saaffaat', englishNameTranslation: 'Those Ranks', numberOfAyahs: 182, revelationType: 'Meccan', juz: 23, page: 446 },
  { number: 38, name: 'ص', englishName: 'Saad', englishNameTranslation: 'Saad', numberOfAyahs: 88, revelationType: 'Meccan', juz: 23, page: 453 },
  { number: 39, name: 'الزُّمَر', englishName: 'Az-Zumar', englishNameTranslation: 'The Groups', numberOfAyahs: 75, revelationType: 'Meccan', juz: 23, page: 458 },
  { number: 40, name: 'غَافِر', englishName: 'Ghafir', englishNameTranslation: 'The Forgiver', numberOfAyahs: 85, revelationType: 'Meccan', juz: 24, page: 467 },
  { number: 41, name: 'فُصِّلَت', englishName: 'Fussilat', englishNameTranslation: 'Explained in Detail', numberOfAyahs: 54, revelationType: 'Meccan', juz: 24, page: 477 },
  { number: 42, name: 'الشُّورَى', englishName: 'Ash-Shura', englishNameTranslation: 'The Consultation', numberOfAyahs: 53, revelationType: 'Meccan', juz: 25, page: 483 },
  { number: 43, name: 'الزُّخْرُف', englishName: 'Az-Zukhruf', englishNameTranslation: 'Gold Ornaments', numberOfAyahs: 89, revelationType: 'Meccan', juz: 25, page: 489 },
  { number: 44, name: 'الدُّخَان', englishName: 'Ad-Dukhaan', englishNameTranslation: 'The Smoke', numberOfAyahs: 59, revelationType: 'Meccan', juz: 25, page: 496 },
  { number: 45, name: 'الجَاثِيَة', englishName: 'Al-Jaathiya', englishNameTranslation: 'The Kneeling', numberOfAyahs: 37, revelationType: 'Meccan', juz: 25, page: 499 },
  { number: 46, name: 'الأَحْقَاف', englishName: 'Al-Ahqaaf', englishNameTranslation: 'The Dunes', numberOfAyahs: 35, revelationType: 'Meccan', juz: 26, page: 502 },
  { number: 47, name: 'مُحَمَّد', englishName: 'Muhammad', englishNameTranslation: 'Muhammad', numberOfAyahs: 38, revelationType: 'Medinan', juz: 26, page: 507 },
  { number: 48, name: 'الفَتْح', englishName: 'Al-Fath', englishNameTranslation: 'The Victory', numberOfAyahs: 29, revelationType: 'Medinan', juz: 26, page: 511 },
  { number: 49, name: 'الحُجُرَات', englishName: 'Al-Hujuraat', englishNameTranslation: 'The Rooms', numberOfAyahs: 18, revelationType: 'Medinan', juz: 26, page: 515 },
  { number: 50, name: 'ق', englishName: 'Qaaf', englishNameTranslation: 'Qaf', numberOfAyahs: 45, revelationType: 'Meccan', juz: 26, page: 518 },
  { number: 51, name: 'الذَّارِيَات', englishName: 'Adh-Dhaariyaat', englishNameTranslation: 'The Winnowing Winds', numberOfAyahs: 60, revelationType: 'Meccan', juz: 26, page: 520 },
  { number: 52, name: 'الطُّور', englishName: 'At-Toor', englishNameTranslation: 'The Mount', numberOfAyahs: 49, revelationType: 'Meccan', juz: 27, page: 523 },
  { number: 53, name: 'النَّجْم', englishName: 'An-Najm', englishNameTranslation: 'The Star', numberOfAyahs: 62, revelationType: 'Meccan', juz: 27, page: 526 },
  { number: 54, name: 'القَمَر', englishName: 'Al-Qamar', englishNameTranslation: 'The Moon', numberOfAyahs: 55, revelationType: 'Meccan', juz: 27, page: 528 },
  { number: 55, name: 'الرَّحْمَٰن', englishName: 'Ar-Rahmaan', englishNameTranslation: 'The Beneficent', numberOfAyahs: 78, revelationType: 'Medinan', juz: 27, page: 531 },
  { number: 56, name: 'الوَاقِعَة', englishName: 'Al-Waaqia', englishNameTranslation: 'The Inevitable', numberOfAyahs: 96, revelationType: 'Meccan', juz: 27, page: 534 },
  { number: 57, name: 'الحَدِيد', englishName: 'Al-Hadeed', englishNameTranslation: 'The Iron', numberOfAyahs: 29, revelationType: 'Medinan', juz: 27, page: 537 },
  { number: 58, name: 'المُجَادَلَة', englishName: 'Al-Mujaadila', englishNameTranslation: 'The Pleading Woman', numberOfAyahs: 22, revelationType: 'Medinan', juz: 28, page: 542 },
  { number: 59, name: 'الحَشْر', englishName: 'Al-Hashr', englishNameTranslation: 'The Exile', numberOfAyahs: 24, revelationType: 'Medinan', juz: 28, page: 545 },
  { number: 60, name: 'المُمْتَحَنَة', englishName: 'Al-Mumtahana', englishNameTranslation: 'She that is to be examined', numberOfAyahs: 13, revelationType: 'Medinan', juz: 28, page: 549 },
  { number: 61, name: 'الصَّفّ', englishName: 'As-Saff', englishNameTranslation: 'The Ranks', numberOfAyahs: 14, revelationType: 'Medinan', juz: 28, page: 551 },
  { number: 62, name: 'الجُمُعَة', englishName: 'Al-Jumu\'a', englishNameTranslation: 'Friday', numberOfAyahs: 11, revelationType: 'Medinan', juz: 28, page: 553 },
  { number: 63, name: 'المُنَافِقُون', englishName: 'Al-Munaafiqoon', englishNameTranslation: 'The Hypocrites', numberOfAyahs: 11, revelationType: 'Medinan', juz: 28, page: 554 },
  { number: 64, name: 'التَّغَابُن', englishName: 'At-Taghaabun', englishNameTranslation: 'Mutual Disillusion', numberOfAyahs: 18, revelationType: 'Medinan', juz: 28, page: 556 },
  { number: 65, name: 'الطَّلَاق', englishName: 'At-Talaaq', englishNameTranslation: 'Divorce', numberOfAyahs: 12, revelationType: 'Medinan', juz: 28, page: 558 },
  { number: 66, name: 'التَّحْرِيم', englishName: 'At-Tahreem', englishNameTranslation: 'The Prohibition', numberOfAyahs: 12, revelationType: 'Medinan', juz: 28, page: 560 },
  { number: 67, name: 'المُلْك', englishName: 'Al-Mulk', englishNameTranslation: 'The Sovereignty', numberOfAyahs: 30, revelationType: 'Meccan', juz: 29, page: 562 },
  { number: 68, name: 'القَلَم', englishName: 'Al-Qalam', englishNameTranslation: 'The Pen', numberOfAyahs: 52, revelationType: 'Meccan', juz: 29, page: 564 },
  { number: 69, name: 'الحَاقَّة', englishName: 'Al-Haaqqa', englishNameTranslation: 'The Reality', numberOfAyahs: 52, revelationType: 'Meccan', juz: 29, page: 566 },
  { number: 70, name: 'المَعَارِج', englishName: 'Al-Ma\'aarij', englishNameTranslation: 'The Ascending Stairways', numberOfAyahs: 44, revelationType: 'Meccan', juz: 29, page: 568 },
  { number: 71, name: 'نُوح', englishName: 'Nooh', englishNameTranslation: 'Noah', numberOfAyahs: 28, revelationType: 'Meccan', juz: 29, page: 570 },
  { number: 72, name: 'الجِنّ', englishName: 'Al-Jinn', englishNameTranslation: 'The Jinn', numberOfAyahs: 28, revelationType: 'Meccan', juz: 29, page: 572 },
  { number: 73, name: 'المُزَّمِّل', englishName: 'Al-Muzzammil', englishNameTranslation: 'The Enshrouded One', numberOfAyahs: 20, revelationType: 'Meccan', juz: 29, page: 574 },
  { number: 74, name: 'المُدَّثِّر', englishName: 'Al-Muddathir', englishNameTranslation: 'The Cloaked One', numberOfAyahs: 56, revelationType: 'Meccan', juz: 29, page: 575 },
  { number: 75, name: 'القِيَامَة', englishName: 'Al-Qiyaama', englishNameTranslation: 'The Resurrection', numberOfAyahs: 40, revelationType: 'Meccan', juz: 29, page: 577 },
  { number: 76, name: 'الإِنْسَان', englishName: 'Al-Insaan', englishNameTranslation: 'Man', numberOfAyahs: 31, revelationType: 'Medinan', juz: 29, page: 578 },
  { number: 77, name: 'المُرْسَلَات', englishName: 'Al-Mursalaat', englishNameTranslation: 'The Emissaries', numberOfAyahs: 50, revelationType: 'Meccan', juz: 29, page: 580 },
  { number: 78, name: 'النَّبَإ', englishName: 'An-Naba', englishNameTranslation: 'The Tidings', numberOfAyahs: 40, revelationType: 'Meccan', juz: 30, page: 582 },
  { number: 79, name: 'النَّازِعَات', englishName: 'An-Naazi\'aat', englishNameTranslation: 'Those who drag forth', numberOfAyahs: 46, revelationType: 'Meccan', juz: 30, page: 583 },
  { number: 80, name: 'عَبَسَ', englishName: 'Abasa', englishNameTranslation: 'He frowned', numberOfAyahs: 42, revelationType: 'Meccan', juz: 30, page: 585 },
  { number: 81, name: 'التَّكْوِير', englishName: 'At-Takweer', englishNameTranslation: 'The Overthrowing', numberOfAyahs: 29, revelationType: 'Meccan', juz: 30, page: 586 },
  { number: 82, name: 'الانْفِطَار', englishName: 'Al-Infitaar', englishNameTranslation: 'The Cleaving', numberOfAyahs: 19, revelationType: 'Meccan', juz: 30, page: 587 },
  { number: 83, name: 'المُطَفِّفِين', englishName: 'Al-Mutaffifeen', englishNameTranslation: 'Defrauding', numberOfAyahs: 36, revelationType: 'Meccan', juz: 30, page: 587 },
  { number: 84, name: 'الانْشِقَاق', englishName: 'Al-Inshiqaaq', englishNameTranslation: 'The Splitting Open', numberOfAyahs: 25, revelationType: 'Meccan', juz: 30, page: 589 },
  { number: 85, name: 'البُرُوج', englishName: 'Al-Burooj', englishNameTranslation: 'The Mansions of the Stars', numberOfAyahs: 22, revelationType: 'Meccan', juz: 30, page: 590 },
  { number: 86, name: 'الطَّارِق', englishName: 'At-Taariq', englishNameTranslation: 'The Morning Star', numberOfAyahs: 17, revelationType: 'Meccan', juz: 30, page: 591 },
  { number: 87, name: 'الأَعْلَى', englishName: 'Al-A\'laa', englishNameTranslation: 'The Most High', numberOfAyahs: 19, revelationType: 'Meccan', juz: 30, page: 591 },
  { number: 88, name: 'الغَاشِيَة', englishName: 'Al-Ghaashiya', englishNameTranslation: 'The Overwhelming', numberOfAyahs: 26, revelationType: 'Meccan', juz: 30, page: 592 },
  { number: 89, name: 'الفَجْر', englishName: 'Al-Fajr', englishNameTranslation: 'The Dawn', numberOfAyahs: 30, revelationType: 'Meccan', juz: 30, page: 593 },
  { number: 90, name: 'البَلَد', englishName: 'Al-Balad', englishNameTranslation: 'The City', numberOfAyahs: 20, revelationType: 'Meccan', juz: 30, page: 594 },
  { number: 91, name: 'الشَّمْس', englishName: 'Ash-Shams', englishNameTranslation: 'The Sun', numberOfAyahs: 15, revelationType: 'Meccan', juz: 30, page: 595 },
  { number: 92, name: 'اللَّيْل', englishName: 'Al-Layl', englishNameTranslation: 'The Night', numberOfAyahs: 21, revelationType: 'Meccan', juz: 30, page: 595 },
  { number: 93, name: 'الضُّحَى', englishName: 'Ad-Dhuhaa', englishNameTranslation: 'The Morning Hours', numberOfAyahs: 11, revelationType: 'Meccan', juz: 30, page: 596 },
  { number: 94, name: 'الشَّرْح', englishName: 'Ash-Sharh', englishNameTranslation: 'The Relief', numberOfAyahs: 8, revelationType: 'Meccan', juz: 30, page: 596 },
  { number: 95, name: 'التِّين', englishName: 'At-Teen', englishNameTranslation: 'The Fig', numberOfAyahs: 8, revelationType: 'Meccan', juz: 30, page: 597 },
  { number: 96, name: 'العَلَق', englishName: 'Al-Alaq', englishNameTranslation: 'The Clot', numberOfAyahs: 19, revelationType: 'Meccan', juz: 30, page: 597 },
  { number: 97, name: 'القَدْر', englishName: 'Al-Qadr', englishNameTranslation: 'The Power', numberOfAyahs: 5, revelationType: 'Meccan', juz: 30, page: 598 },
  { number: 98, name: 'البَيِّنَة', englishName: 'Al-Bayyina', englishNameTranslation: 'The Clear Proof', numberOfAyahs: 8, revelationType: 'Medinan', juz: 30, page: 598 },
  { number: 99, name: 'الزَّلْزَلَة', englishName: 'Az-Zalzala', englishNameTranslation: 'The Earthquake', numberOfAyahs: 8, revelationType: 'Medinan', juz: 30, page: 599 },
  { number: 100, name: 'العَادِيَات', englishName: 'Al-Aadiyaat', englishNameTranslation: 'The Courser', numberOfAyahs: 11, revelationType: 'Meccan', juz: 30, page: 599 },
  { number: 101, name: 'القَارِعَة', englishName: 'Al-Qaari\'a', englishNameTranslation: 'The Calamity', numberOfAyahs: 11, revelationType: 'Meccan', juz: 30, page: 600 },
  { number: 102, name: 'التَّكَاثُر', englishName: 'At-Takaathur', englishNameTranslation: 'The Rivalry in World Increase', numberOfAyahs: 8, revelationType: 'Meccan', juz: 30, page: 600 },
  { number: 103, name: 'العَصْر', englishName: 'Al-Asr', englishNameTranslation: 'The Declining Day', numberOfAyahs: 3, revelationType: 'Meccan', juz: 30, page: 601 },
  { number: 104, name: 'الهُمَزَة', englishName: 'Al-Humaza', englishNameTranslation: 'The Traducer', numberOfAyahs: 9, revelationType: 'Meccan', juz: 30, page: 601 },
  { number: 105, name: 'الفِيل', englishName: 'Al-Feel', englishNameTranslation: 'The Elephant', numberOfAyahs: 5, revelationType: 'Meccan', juz: 30, page: 601 },
  { number: 106, name: 'قُرَيْش', englishName: 'Quraish', englishNameTranslation: 'Quraysh', numberOfAyahs: 4, revelationType: 'Meccan', juz: 30, page: 602 },
  { number: 107, name: 'المَاعُون', englishName: 'Al-Maa\'oon', englishNameTranslation: 'The Small Kindness', numberOfAyahs: 7, revelationType: 'Meccan', juz: 30, page: 602 },
  { number: 108, name: 'الكَوْثَر', englishName: 'Al-Kawthar', englishNameTranslation: 'The Abundance', numberOfAyahs: 3, revelationType: 'Meccan', juz: 30, page: 602 },
  { number: 109, name: 'الكَافِرُون', englishName: 'Al-Kaafiroon', englishNameTranslation: 'The Disbelievers', numberOfAyahs: 6, revelationType: 'Meccan', juz: 30, page: 603 },
  { number: 110, name: 'النَّصْر', englishName: 'An-Nasr', englishNameTranslation: 'The Divine Support', numberOfAyahs: 3, revelationType: 'Medinan', juz: 30, page: 603 },
  { number: 111, name: 'المَسَد', englishName: 'Al-Masad', englishNameTranslation: 'The Palm Fiber', numberOfAyahs: 5, revelationType: 'Meccan', juz: 30, page: 603 },
  { number: 112, name: 'الإِخْلَاص', englishName: 'Al-Ikhlaas', englishNameTranslation: 'The Sincerity', numberOfAyahs: 4, revelationType: 'Meccan', juz: 30, page: 604 },
  { number: 113, name: 'الفَلَق', englishName: 'Al-Falaq', englishNameTranslation: 'The Daybreak', numberOfAyahs: 5, revelationType: 'Meccan', juz: 30, page: 604 },
  { number: 114, name: 'النَّاس', englishName: 'An-Naas', englishNameTranslation: 'Mankind', numberOfAyahs: 6, revelationType: 'Meccan', juz: 30, page: 604 }
];

// Offline instant data for essential and frequently recited Surahs
export const PRELOADED_SURAHS: Record<number, AyahItem[]> = {
  1: [
    { numberInSurah: 1, text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', translation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.' },
    { numberInSurah: 2, text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', translation: '[All] praise is [due] to Allah, Lord of the worlds.' },
    { numberInSurah: 3, text: 'الرَّحْمَٰنِ الرَّحِيمِ', translation: 'The Entirely Merciful, the Especially Merciful,' },
    { numberInSurah: 4, text: 'مَالِكِ يَوْمِ الدِّينِ', translation: 'Sovereign of the Day of Recompense.' },
    { numberInSurah: 5, text: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', translation: 'It is You we worship and You we ask for help.' },
    { numberInSurah: 6, text: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', translation: 'Guide us to the straight path -' },
    { numberInSurah: 7, text: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', translation: 'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.' }
  ],
  67: [
    { numberInSurah: 1, text: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ', translation: 'Blessed is He in whose hand is dominion, and He is over all things competent -' },
    { numberInSurah: 2, text: 'الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ', translation: '[He] who created death and life to test you [as to] which of you is best in deed - and He is the Exalted in Might, the Forgiving -' },
    { numberInSurah: 3, text: 'الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ ۖ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ', translation: '[And] who created seven heavens in layers. You see not in the creation of the Most Merciful any inconsistency.' },
    { numberInSurah: 4, text: 'ثُمَّ ارْجِعِ الْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ الْبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ', translation: 'Then return [your] vision twice again. [Your] vision will return to you humbled while it is fatigued.' },
    { numberInSurah: 5, text: 'وَلَقَدْ زَيَّنَّا السَّمَاءَ الدُّنْيَا بِمَصَابِيحَ وَجَعَلْنَاهَا رُجُومًا لِّلشَّيَاطِينِ ۖ وَأَعْتَدْنَا لَهُمْ عَذَابَ السَّعِيرِ', translation: 'And We have certainly beautified the nearest heaven with stars and have made [from] them missiles for the devils.' }
  ],
  97: [
    { numberInSurah: 1, text: 'إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ', translation: 'Indeed, We sent the Quran down during the Night of Decree.' },
    { numberInSurah: 2, text: 'وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ', translation: 'And what can make you know what is the Night of Decree?' },
    { numberInSurah: 3, text: 'لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ', translation: 'The Night of Decree is better than a thousand months.' },
    { numberInSurah: 4, text: 'تَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا بِإِذْنِ رَبِّهِم مِّن كُلِّ أَمْرٍ', translation: 'The angels and the Spirit descend therein by permission of their Lord for every matter.' },
    { numberInSurah: 5, text: 'سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ', translation: 'Peace it is until the emergence of dawn.' }
  ],
  108: [
    { numberInSurah: 1, text: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ', translation: 'Indeed, We have granted you, [O Muhammad], al-Kawthar.' },
    { numberInSurah: 2, text: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ', translation: 'So pray to your Lord and sacrifice [to Him alone].' },
    { numberInSurah: 3, text: 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ', translation: 'Indeed, your enemy is the one cut off.' }
  ],
  112: [
    { numberInSurah: 1, text: 'قُلْ هُوَ اللَّهُ أَحَدٌ', translation: 'Say, "He is Allah, [who is] One,' },
    { numberInSurah: 2, text: 'اللَّهُ الصَّمَدُ', translation: 'Allah, the Eternal Refuge.' },
    { numberInSurah: 3, text: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', translation: 'He neither begets nor is born,' },
    { numberInSurah: 4, text: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', translation: 'Nor is there to Him any equivalent."' }
  ],
  113: [
    { numberInSurah: 1, text: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', translation: 'Say, "I seek refuge in the Lord of daybreak' },
    { numberInSurah: 2, text: 'مِن شَرِّ مَا خَلَقَ', translation: 'From the evil of that which He created' },
    { numberInSurah: 3, text: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ', translation: 'And from the evil of darkness when it settles' },
    { numberInSurah: 4, text: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ', translation: 'And from the evil of the blowers in knots' },
    { numberInSurah: 5, text: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ', translation: 'And from the evil of an envier when he envies."' }
  ],
  114: [
    { numberInSurah: 1, text: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', translation: 'Say, "I seek refuge in the Lord of mankind,' },
    { numberInSurah: 2, text: 'مَلِكِ النَّاسِ', translation: 'The Sovereign of mankind,' },
    { numberInSurah: 3, text: 'إِلَٰهِ النَّاسِ', translation: 'The God of mankind,' },
    { numberInSurah: 4, text: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ', translation: 'From the evil of the retreating whisperer -' },
    { numberInSurah: 5, text: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ', translation: 'Who whispers [evil] into the breasts of mankind -' },
    { numberInSurah: 6, text: 'مِنَ الْجِنَّةِ وَالنَّاسِ', translation: 'From among the jinn and mankind."' }
  ]
};

// Memory cache for fetched surahs
const surahCache = new Map<number, AyahItem[]>();

export async function fetchSurahAyahs(surahNumber: number): Promise<AyahItem[]> {
  // 1. Check in-memory cache
  if (surahCache.has(surahNumber)) {
    return surahCache.get(surahNumber)!;
  }

  // 2. Check localStorage cache
  try {
    const localRaw = localStorage.getItem(`hisn_quran_surah_${surahNumber}`);
    if (localRaw) {
      const parsed: AyahItem[] = JSON.parse(localRaw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        surahCache.set(surahNumber, parsed);
        return parsed;
      }
    }
  } catch {
    // Ignore cache error
  }

  // 3. Check preloaded
  if (PRELOADED_SURAHS[surahNumber] && PRELOADED_SURAHS[surahNumber].length === ALL_SURAHS[surahNumber - 1]?.numberOfAyahs) {
    surahCache.set(surahNumber, PRELOADED_SURAHS[surahNumber]);
    return PRELOADED_SURAHS[surahNumber];
  }

  // 4. Fetch from high-reliability Quran API
  try {
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,en.sahih`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (data.status === 'OK' && data.data && data.data.length >= 2) {
      const arabicEdition = data.data[0];
      const englishEdition = data.data[1];

      const ayahs: AyahItem[] = arabicEdition.ayahs.map((ayah: { numberInSurah: number; text: string; juz: number; page: number }, idx: number) => {
        let arabicText = ayah.text;
        // Clean initial Bismillah if present in ayah 1 (except Surah 1)
        if (surahNumber !== 1 && ayah.numberInSurah === 1 && arabicText.startsWith('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ')) {
          arabicText = arabicText.replace('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', '').trim();
          if (!arabicText) {
            arabicText = ayah.text;
          }
        }

        return {
          numberInSurah: ayah.numberInSurah,
          text: arabicText,
          translation: englishEdition.ayahs[idx]?.text || '',
          juz: ayah.juz,
          page: ayah.page
        };
      });

      // Save to memory and localStorage
      surahCache.set(surahNumber, ayahs);
      try {
        localStorage.setItem(`hisn_quran_surah_${surahNumber}`, JSON.stringify(ayahs));
      } catch {
        // storage quota exceeded, ok to ignore
      }

      return ayahs;
    }
  } catch (err) {
    console.warn(`Failed to fetch Surah ${surahNumber} from network:`, err);
  }

  // Fallback to preloaded if available
  if (PRELOADED_SURAHS[surahNumber]) {
    return PRELOADED_SURAHS[surahNumber];
  }

  // Minimal fallback placeholder with Surah metadata
  const meta = ALL_SURAHS[surahNumber - 1];
  return [
    {
      numberInSurah: 1,
      text: `سورة ${meta.name} - الآية ١ (يرجى الاتصال بالإنترنت لتحميل كامل نص السورة).`,
      translation: `Surah ${meta.englishName} (Please connect to the internet to load all verses).`
    }
  ];
}
