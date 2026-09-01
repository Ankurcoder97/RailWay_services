"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchTrains = searchTrains;
exports.getTrainsBetweenStations = getTrainsBetweenStations;
exports.getLiveTrainStatus = getLiveTrainStatus;
const axios_1 = __importDefault(require("axios"));
const RAILRADAR_BASE_URL = 'https://api.railradar.in/v1';
const STATION_CODE_MAP = {
    goghat: 'GOGH',
    gosaigaonhat: 'GOGH',
    gogh: 'GOGH',
    tarakeswar: 'TAK',
    tak: 'TAK',
    haripal: 'HPL',
    hpl: 'HPL',
    howrah: 'HWH',
    hwh: 'HWH',
    mumbai: 'MMCT',
    mmct: 'MMCT',
    'mumbai central': 'MMCT',
    delhi: 'NDLS',
    ndls: 'NDLS',
    'new delhi': 'NDLS',
    kanpur: 'CNB',
    cnb: 'CNB',
    'kanpur central': 'CNB',
    prayagraj: 'PRYJ',
    pryj: 'PRYJ',
    varanasi: 'BSB',
    bsb: 'BSB',
    kolkata: 'HWH',
    sealdah: 'SDAH',
    sdah: 'SDAH',
    patna: 'PNBE',
    pnbe: 'PNBE',
    chennai: 'MAS',
    mas: 'MAS',
    bengaluru: 'SBC',
    sbc: 'SBC',
    secunderabad: 'SC',
    sc: 'SC',
    ahmedabad: 'ADI',
    adi: 'ADI',
    pune: 'PUNE',
    jaipur: 'JP',
    jp: 'JP',
    bhopal: 'BPL',
    bpl: 'BPL',
    godhra: 'GDA',
    gda: 'GDA',
    kharsaliya: 'KRSA',
    krsa: 'KRSA',
    surat: 'ST',
    st: 'ST',
    vadodara: 'BRC',
    brc: 'BRC',
    ratlam: 'RTM',
    rtm: 'RTM',
    kota: 'KOTA',
};
const LOCAL_TRAINS_MASTER = {
    // UP TRAINS (Goghat/Tarakeswar/Haripal -> Howrah)
    '37306': { name: 'Haripal - Howrah Local (EMU)', source: 'Haripal (HPL)', dest: 'Howrah Junction (HWH)', dep: '07:15 AM', arr: '08:35 AM', isUp: true },
    '37308': { name: 'Tarakeswar - Howrah Local (EMU)', source: 'Tarakeswar (TAK)', dest: 'Howrah Junction (HWH)', dep: '08:25 AM', arr: '09:55 AM', isUp: true },
    '37310': { name: 'Tarakeswar - Howrah Local (EMU)', source: 'Tarakeswar (TAK)', dest: 'Howrah Junction (HWH)', dep: '09:30 AM', arr: '11:00 AM', isUp: true },
    '37312': { name: 'Goghat - Howrah Local (EMU)', source: 'Goghat (GOGH)', dest: 'Howrah Junction (HWH)', dep: '10:55 AM', arr: '01:00 PM', isUp: true },
    '37316': { name: 'Tarakeswar - Howrah Local (EMU)', source: 'Tarakeswar (TAK)', dest: 'Howrah Junction (HWH)', dep: '12:00 PM', arr: '01:30 PM', isUp: true },
    '37320': { name: 'Tarakeswar - Howrah Fast Local (EMU)', source: 'Tarakeswar (TAK)', dest: 'Howrah Junction (HWH)', dep: '03:05 PM', arr: '04:30 PM', isUp: true },
    '37328': { name: 'Tarakeswar - Howrah Local (EMU)', source: 'Tarakeswar (TAK)', dest: 'Howrah Junction (HWH)', dep: '06:15 PM', arr: '07:45 PM', isUp: true },
    '37336': { name: 'Goghat - Howrah Local (EMU)', source: 'Goghat (GOGH)', dest: 'Howrah Junction (HWH)', dep: '08:35 PM', arr: '10:40 PM', isUp: true },
    '37344': { name: 'Tarakeswar - Howrah Local (EMU)', source: 'Tarakeswar (TAK)', dest: 'Howrah Junction (HWH)', dep: '10:10 PM', arr: '11:40 PM', isUp: true },
    // DOWN TRAINS (Howrah -> Haripal/Tarakeswar/Goghat)
    '37305': { name: 'Howrah - Haripal Local (EMU)', source: 'Howrah Junction (HWH)', dest: 'Haripal (HPL)', dep: '05:40 AM', arr: '07:00 AM', isUp: false },
    '37307': { name: 'Howrah - Tarakeswar Local (EMU)', source: 'Howrah Junction (HWH)', dest: 'Tarakeswar (TAK)', dep: '06:40 AM', arr: '08:12 AM', isUp: false },
    '37309': { name: 'Howrah - Tarakeswar Local (EMU)', source: 'Howrah Junction (HWH)', dest: 'Tarakeswar (TAK)', dep: '07:45 AM', arr: '09:15 AM', isUp: false },
    '37311': { name: 'Howrah - Goghat Local (EMU)', source: 'Howrah Junction (HWH)', dest: 'Goghat (GOGH)', dep: '08:35 AM', arr: '10:40 AM', isUp: false },
    '37315': { name: 'Howrah - Tarakeswar Local (EMU)', source: 'Howrah Junction (HWH)', dest: 'Tarakeswar (TAK)', dep: '10:15 AM', arr: '11:45 AM', isUp: false },
    '37319': { name: 'Howrah - Tarakeswar Fast Local (EMU)', source: 'Howrah Junction (HWH)', dest: 'Tarakeswar (TAK)', dep: '01:25 PM', arr: '02:50 PM', isUp: false },
    '37327': { name: 'Howrah - Tarakeswar Local (EMU)', source: 'Howrah Junction (HWH)', dest: 'Tarakeswar (TAK)', dep: '04:30 PM', arr: '06:02 PM', isUp: false },
    '37335': { name: 'Howrah - Goghat Local (EMU)', source: 'Howrah Junction (HWH)', dest: 'Goghat (GOGH)', dep: '06:15 PM', arr: '08:20 PM', isUp: false },
    '37343': { name: 'Howrah - Tarakeswar Local (EMU)', source: 'Howrah Junction (HWH)', dest: 'Tarakeswar (TAK)', dep: '08:25 PM', arr: '09:55 PM', isUp: false },
    '37349': { name: 'Howrah - Tarakeswar Night Local (EMU)', source: 'Howrah Junction (HWH)', dest: 'Tarakeswar (TAK)', dep: '10:05 PM', arr: '11:35 PM', isUp: false },
    '37347': { name: 'Howrah - Tarakeswar Local (EMU)', source: 'Howrah Junction (HWH)', dest: 'Tarakeswar (TAK)', dep: '10:15 PM', arr: '11:45 PM', isUp: false },
    '37351': { name: 'Howrah - Tarakeswar Late Night Local (EMU)', source: 'Howrah Junction (HWH)', dest: 'Tarakeswar (TAK)', dep: '11:05 PM', arr: '12:35 AM', isUp: false }
};
const HWH_TAK_MASTER_ROUTE = [
    { code: 'HWH', name: 'Howrah Junction', platform: '4', dist: 0, lat: 22.582, lng: 88.342 },
    { code: 'HJN', name: 'Howrah Jn Cabin', platform: '1', dist: 1, lat: 22.590, lng: 88.340 },
    { code: 'SYAE', name: 'Liluah Sorting Yard Cabin', platform: '1', dist: 3, lat: 22.610, lng: 88.335 },
    { code: 'LLH', name: 'Liluah', platform: '3', dist: 5, lat: 22.620, lng: 88.330 },
    { code: 'BEQ', name: 'Belur', platform: '3', dist: 6, lat: 22.630, lng: 88.325 },
    { code: 'BLY', name: 'Bally', platform: '1', dist: 9, lat: 22.650, lng: 88.320 },
    { code: 'BLYC', name: 'Bally Chord', platform: '1', dist: 9, lat: 22.655, lng: 88.318 },
    { code: 'UPA', name: 'Uttarpara', platform: '1', dist: 10, lat: 22.662, lng: 88.348 },
    { code: 'HMZ', name: 'Hind Motor', platform: '1', dist: 12, lat: 22.678, lng: 88.342 },
    { code: 'KOG', name: 'Konnagar', platform: '1', dist: 14, lat: 22.700, lng: 88.340 },
    { code: 'RIS', name: 'Rishra', platform: '1', dist: 16, lat: 22.715, lng: 88.346 },
    { code: 'SRP', name: 'Serampore', platform: '1', dist: 19, lat: 22.752, lng: 88.342 },
    { code: 'SHE', name: 'Seoraphuli Junction', platform: '1', dist: 22, lat: 22.760, lng: 88.330 },
    { code: 'DEA', name: 'Diara', platform: '1', dist: 27, lat: 22.775, lng: 88.290 },
    { code: 'NSF', name: 'Nasibpur', platform: '1', dist: 30, lat: 22.790, lng: 88.260 },
    { code: 'SIGR', name: 'Singur', platform: '1', dist: 34, lat: 22.812, lng: 88.229 },
    { code: 'KQLS', name: 'Kamarkundu', platform: '1', dist: 36, lat: 22.822, lng: 88.200 },
    { code: 'NKL', name: 'Nalikul', platform: '1', dist: 40, lat: 22.825, lng: 88.160 },
    { code: 'MLLK', name: 'Maliya', platform: '1', dist: 43, lat: 22.828, lng: 88.130 },
    { code: 'HPL', name: 'Haripal', platform: '1', dist: 45, lat: 22.831, lng: 88.119 },
    { code: 'KKAE', name: 'Kaakala', platform: '1', dist: 48, lat: 22.845, lng: 88.080 },
    { code: 'BAHW', name: 'Bahirkhanda', platform: '1', dist: 51, lat: 22.855, lng: 88.050 },
    { code: 'LOK', name: 'Loknath', platform: '1', dist: 55, lat: 22.870, lng: 88.025 },
    { code: 'TAK', name: 'Tarakeswar', platform: '1', dist: 57, lat: 22.882, lng: 88.014 },
    { code: 'GOGH', name: 'Goghat', platform: '1', dist: 84, lat: 22.875, lng: 87.705 }
];
function timeToMinutes(timeStr) {
    if (!timeStr)
        return 0;
    const str = String(timeStr).trim();
    let h = 0, m = 0;
    if (str.includes('PM') || str.includes('pm')) {
        const parts = str.replace(/(AM|PM|am|pm)/gi, '').trim().split(':');
        h = parseInt(parts[0], 10) || 0;
        m = parseInt(parts[1], 10) || 0;
        if (h < 12)
            h += 12;
    }
    else if (str.includes('AM') || str.includes('am')) {
        const parts = str.replace(/(AM|PM|am|pm)/gi, '').trim().split(':');
        h = parseInt(parts[0], 10) || 0;
        m = parseInt(parts[1], 10) || 0;
        if (h === 12)
            h = 0;
    }
    else {
        const parts = str.split(':');
        h = parseInt(parts[0], 10) || 0;
        m = parseInt(parts[1], 10) || 0;
    }
    return h * 60 + m;
}
function resolveStationCode(query) {
    const clean = query.trim().toLowerCase();
    const codeMatch = clean.match(/\((.*?)\)/);
    if (codeMatch && codeMatch[1]) {
        return codeMatch[1].toUpperCase();
    }
    if (STATION_CODE_MAP[clean]) {
        return STATION_CODE_MAP[clean];
    }
    for (const [key, code] of Object.entries(STATION_CODE_MAP)) {
        if (clean.includes(key) || key.includes(clean)) {
            return code;
        }
    }
    return clean.substring(0, 4).toUpperCase();
}
function getStationWeather(code, idx) {
    const weatherPresets = {
        HWH: { tempC: 28, condition: 'Clear', icon: '🌙' },
        HJN: { tempC: 28, condition: 'Clear', icon: '🌙' },
        SYAE: { tempC: 28, condition: 'Clear', icon: '🌙' },
        LLH: { tempC: 28, condition: 'Clear', icon: '🌙' },
        BEQ: { tempC: 27, condition: 'Clear', icon: '🌙' },
        BLY: { tempC: 27, condition: 'Clear', icon: '🌙' },
        BLYC: { tempC: 27, condition: 'Clear', icon: '🌙' },
        UPA: { tempC: 27, condition: 'Partly Cloudy', icon: '⛅' },
        HMZ: { tempC: 27, condition: 'Partly Cloudy', icon: '⛅' },
        SIGR: { tempC: 26, condition: 'Partly Cloudy', icon: '⛅' },
        HPL: { tempC: 26, condition: 'Light Rain', icon: '🌧️' },
        TAK: { tempC: 26, condition: 'Light Rain', icon: '🌧️' },
        GOGH: { tempC: 25, condition: 'Light Rain', icon: '🌧️' },
        NDLS: { tempC: 32, condition: 'Sunny', icon: '☀️' },
        MMCT: { tempC: 30, condition: 'Humid', icon: '🌤️' },
        MAS: { tempC: 31, condition: 'Warm', icon: '☀️' },
        SBC: { tempC: 24, condition: 'Pleasant', icon: '⛅' },
    };
    if (weatherPresets[code])
        return weatherPresets[code];
    const baseTemp = 27 + (idx % 4) - 2;
    const icons = ['☀️', '🌤️', '⛅', '🌙'];
    const conds = ['Clear', 'Partly Cloudy', 'Pleasant', 'Hazy'];
    return {
        tempC: baseTemp,
        condition: conds[idx % conds.length],
        icon: icons[idx % icons.length]
    };
}
function formatTime(isoString) {
    if (!isoString)
        return undefined;
    const clean = String(isoString).trim();
    // 1. If ISO timestamp string (e.g. "2026-09-01T22:05:00+05:30")
    const tIndex = clean.indexOf('T');
    if (tIndex >= 0 && clean.length >= tIndex + 6) {
        const timePart = clean.substring(tIndex + 1, tIndex + 6);
        const parts = timePart.split(':');
        if (parts.length === 2 && !isNaN(parseInt(parts[0], 10))) {
            let hours = parseInt(parts[0], 10);
            const mStr = parts[1];
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            if (hours === 0)
                hours = 12;
            const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
            return `${formattedHours}:${mStr} ${ampm}`;
        }
    }
    // 2. If already 12-hour format with AM/PM (e.g. "10:05 PM")
    if (/\d{1,2}:\d{2}\s*(am|pm)/i.test(clean)) {
        return clean;
    }
    // 3. If 24-hour time HH:mm (e.g. "22:05", "17:00", "05:40")
    if (clean.includes(':')) {
        const parts = clean.split(':');
        if (parts.length >= 2 && !isNaN(parseInt(parts[0], 10))) {
            let hours = parseInt(parts[0], 10);
            const mStr = parts[1].substring(0, 2);
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            if (hours === 0)
                hours = 12;
            const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
            return `${formattedHours}:${mStr} ${ampm}`;
        }
    }
    return clean;
}
async function searchTrains(query) {
    const q = query.trim();
    if (!q)
        return [];
    const apiKey = process.env.RAILRADAR_API_KEY || 'rg_ab166db828b7493bb0084338f68545c9';
    const headers = { Authorization: `Bearer ${apiKey}` };
    const trainNumMatch = q.match(/\d{5}/);
    const trainNum = trainNumMatch ? trainNumMatch[0] : q;
    if (/^\d{5}$/.test(trainNum)) {
        try {
            const res = await axios_1.default.get(`${RAILRADAR_BASE_URL}/trains/${trainNum}`, { headers, timeout: 5000 });
            if (res.data && res.data.data && res.data.data.train) {
                const t = res.data.data.train;
                const master = LOCAL_TRAINS_MASTER[trainNum];
                return [
                    {
                        trainNumber: t.number || trainNum,
                        trainName: master?.name || t.name || `Train ${trainNum}`,
                        source: master?.source || (t.source?.name ? `${t.source.name} (${t.source.code})` : 'Origin'),
                        destination: master?.dest || (t.destination?.name ? `${t.destination.name} (${t.destination.code})` : 'Destination'),
                        runsOn: t.runDays || ['Daily']
                    }
                ];
            }
        }
        catch (e) {
            // Fallthrough
        }
    }
    const popularList = [
        { trainNumber: '37305', trainName: 'Howrah - Haripal Local (EMU)', source: 'Howrah Junction (HWH)', destination: 'Haripal (HPL)', runsOn: ['Daily'] },
        { trainNumber: '37306', trainName: 'Haripal - Howrah Local (EMU)', source: 'Haripal (HPL)', destination: 'Howrah Junction (HWH)', runsOn: ['Daily'] },
        { trainNumber: '37307', trainName: 'Howrah - Tarakeswar Local (EMU)', source: 'Howrah Junction (HWH)', destination: 'Tarakeswar (TAK)', runsOn: ['Daily'] },
        { trainNumber: '37308', trainName: 'Tarakeswar - Howrah Local (EMU)', source: 'Tarakeswar (TAK)', destination: 'Howrah Junction (HWH)', runsOn: ['Daily'] },
        { trainNumber: '37309', trainName: 'Howrah - Tarakeswar Local (EMU)', source: 'Howrah Junction (HWH)', destination: 'Tarakeswar (TAK)', runsOn: ['Daily'] },
        { trainNumber: '37310', trainName: 'Tarakeswar - Howrah Local (EMU)', source: 'Tarakeswar (TAK)', destination: 'Howrah Junction (HWH)', runsOn: ['Daily'] },
        { trainNumber: '37311', trainName: 'Howrah - Goghat Local (EMU)', source: 'Howrah Junction (HWH)', destination: 'Goghat (GOGH)', runsOn: ['Daily'] },
        { trainNumber: '37312', trainName: 'Goghat - Howrah Local (EMU)', source: 'Goghat (GOGH)', destination: 'Howrah Junction (HWH)', runsOn: ['Daily'] },
        { trainNumber: '37319', trainName: 'Howrah - Tarakeswar Fast Local (EMU)', source: 'Howrah Junction (HWH)', destination: 'Tarakeswar (TAK)', runsOn: ['Daily'] },
        { trainNumber: '37336', trainName: 'Goghat - Howrah Local (EMU)', source: 'Goghat (GOGH)', destination: 'Howrah Junction (HWH)', runsOn: ['Daily'] },
        { trainNumber: '37349', trainName: 'Howrah - Tarakeswar Night Local (EMU)', source: 'Howrah Junction (HWH)', destination: 'Tarakeswar (TAK)', runsOn: ['Daily'] },
        { trainNumber: '15960', trainName: 'Kamrup Express', source: 'Gosaigaonhat / Goghat (GOGH)', destination: 'Howrah Junction (HWH)', runsOn: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat'] },
        { trainNumber: '12951', trainName: 'Mumbai Rajdhani Express', source: 'Mumbai Central (MMCT)', destination: 'New Delhi (NDLS)', runsOn: ['Daily'] },
        { trainNumber: '22436', trainName: 'Vande Bharat Express', source: 'New Delhi (NDLS)', destination: 'Varanasi Jn (BSB)', runsOn: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat', 'Sun'] }
    ];
    const matches = popularList.filter(t => t.trainNumber.includes(q) || t.trainName.toLowerCase().includes(q.toLowerCase()) || t.source.toLowerCase().includes(q.toLowerCase()) || t.destination.toLowerCase().includes(q.toLowerCase()));
    if (matches.length > 0)
        return matches;
    return [
        {
            trainNumber: trainNum.toUpperCase(),
            trainName: `Express/Local Train (${trainNum.toUpperCase()})`,
            source: 'New Delhi (NDLS)',
            destination: 'Mumbai Central (MMCT)',
            runsOn: ['Daily']
        }
    ];
}
async function getTrainsBetweenStations(fromQuery, toQuery) {
    const fromCode = resolveStationCode(fromQuery);
    const toCode = resolveStationCode(toQuery);
    const apiKey = process.env.RAILRADAR_API_KEY || 'rg_ab166db828b7493bb0084338f68545c9';
    const headers = { Authorization: `Bearer ${apiKey}` };
    let apiTrains = [];
    try {
        const res = await axios_1.default.get(`${RAILRADAR_BASE_URL}/trains/between/${fromCode}/${toCode}`, { headers, timeout: 6000 });
        if (res.data && res.data.data && Array.isArray(res.data.data.trains) && res.data.data.trains.length > 0) {
            apiTrains = res.data.data.trains.map((t) => ({
                trainNumber: t.train?.number || '37305',
                trainName: t.train?.name || `${t.train?.type || 'Local'} Train`,
                source: `${t.from?.name || fromQuery} (${t.from?.code || fromCode})`,
                destination: `${t.to?.name || toQuery} (${t.to?.code || toCode})`,
                departureTime: formatTime(t.from?.departure) || '05:40 AM',
                arrivalTime: formatTime(t.to?.arrival) || '07:00 AM',
                runsOn: t.train?.runDays || ['Daily']
            }));
        }
    }
    catch (err) {
        console.warn(`RailRadar trains between ${fromCode}->${toCode} call note:`, err.message);
    }
    const isToHowrah = toCode === 'HWH';
    const isTarakeswarBranch = ['HWH', 'TAK', 'GOGH', 'HPL'].includes(fromCode) && ['HWH', 'TAK', 'GOGH', 'HPL'].includes(toCode);
    if (isTarakeswarBranch) {
        let resultList = [];
        if (isToHowrah) {
            resultList = [
                { trainNumber: '37306', trainName: 'Haripal - Howrah Local (EMU)', source: 'Haripal (HPL)', destination: 'Howrah Junction (HWH)', departureTime: '07:15 AM', arrivalTime: '08:35 AM', runsOn: ['Daily'] },
                { trainNumber: '37308', trainName: 'Tarakeswar - Howrah Local (EMU)', source: 'Tarakeswar (TAK)', destination: 'Howrah Junction (HWH)', departureTime: '08:25 AM', arrivalTime: '09:55 AM', runsOn: ['Daily'] },
                { trainNumber: '37310', trainName: 'Tarakeswar - Howrah Local (EMU)', source: 'Tarakeswar (TAK)', destination: 'Howrah Junction (HWH)', departureTime: '09:30 AM', arrivalTime: '11:00 AM', runsOn: ['Daily'] },
                { trainNumber: '37312', trainName: 'Goghat - Howrah Local (EMU)', source: 'Goghat (GOGH)', destination: 'Howrah Junction (HWH)', departureTime: '10:55 AM', arrivalTime: '01:00 PM', runsOn: ['Daily'] },
                { trainNumber: '37316', trainName: 'Tarakeswar - Howrah Local (EMU)', source: 'Tarakeswar (TAK)', destination: 'Howrah Junction (HWH)', departureTime: '12:00 PM', arrivalTime: '01:30 PM', runsOn: ['Daily'] },
                { trainNumber: '37320', trainName: 'Tarakeswar - Howrah Fast Local (EMU)', source: 'Tarakeswar (TAK)', destination: 'Howrah Junction (HWH)', departureTime: '03:05 PM', arrivalTime: '04:30 PM', runsOn: ['Daily'] },
                { trainNumber: '37328', trainName: 'Tarakeswar - Howrah Local (EMU)', source: 'Tarakeswar (TAK)', destination: 'Howrah Junction (HWH)', departureTime: '06:15 PM', arrivalTime: '07:45 PM', runsOn: ['Daily'] },
                { trainNumber: '37336', trainName: 'Goghat - Howrah Local (EMU)', source: 'Goghat (GOGH)', destination: 'Howrah Junction (HWH)', departureTime: '08:35 PM', arrivalTime: '10:40 PM', runsOn: ['Daily'] },
                { trainNumber: '37344', trainName: 'Tarakeswar - Howrah Local (EMU)', source: 'Tarakeswar (TAK)', destination: 'Howrah Junction (HWH)', departureTime: '10:10 PM', arrivalTime: '11:40 PM', runsOn: ['Daily'] }
            ];
        }
        else {
            resultList = [
                { trainNumber: '37305', trainName: 'Howrah - Haripal Local (EMU)', source: 'Howrah Junction (HWH)', destination: 'Haripal (HPL)', departureTime: '05:40 AM', arrivalTime: '07:00 AM', runsOn: ['Daily'] },
                { trainNumber: '37307', trainName: 'Howrah - Tarakeswar Local (EMU)', source: 'Howrah Junction (HWH)', destination: 'Tarakeswar (TAK)', departureTime: '06:40 AM', arrivalTime: '08:12 AM', runsOn: ['Daily'] },
                { trainNumber: '37309', trainName: 'Howrah - Tarakeswar Local (EMU)', source: 'Howrah Junction (HWH)', destination: 'Tarakeswar (TAK)', departureTime: '07:45 AM', arrivalTime: '09:15 AM', runsOn: ['Daily'] },
                { trainNumber: '37311', trainName: 'Howrah - Goghat Local (EMU)', source: 'Howrah Junction (HWH)', destination: 'Goghat (GOGH)', departureTime: '08:35 AM', arrivalTime: '10:40 AM', runsOn: ['Daily'] },
                { trainNumber: '37315', trainName: 'Howrah - Tarakeswar Local (EMU)', source: 'Howrah Junction (HWH)', destination: 'Tarakeswar (TAK)', departureTime: '10:15 AM', arrivalTime: '11:45 AM', runsOn: ['Daily'] },
                { trainNumber: '37319', trainName: 'Howrah - Tarakeswar Fast Local (EMU)', source: 'Howrah Junction (HWH)', destination: 'Tarakeswar (TAK)', departureTime: '01:25 PM', arrivalTime: '02:50 PM', runsOn: ['Daily'] },
                { trainNumber: '37327', trainName: 'Howrah - Tarakeswar Local (EMU)', source: 'Howrah Junction (HWH)', destination: 'Tarakeswar (TAK)', departureTime: '04:30 PM', arrivalTime: '06:02 PM', runsOn: ['Daily'] },
                { trainNumber: '37335', trainName: 'Howrah - Goghat Local (EMU)', source: 'Howrah Junction (HWH)', destination: 'Goghat (GOGH)', departureTime: '06:15 PM', arrivalTime: '08:20 PM', runsOn: ['Daily'] },
                { trainNumber: '37343', trainName: 'Howrah - Tarakeswar Local (EMU)', source: 'Howrah Junction (HWH)', destination: 'Tarakeswar (TAK)', departureTime: '08:25 PM', arrivalTime: '09:55 PM', runsOn: ['Daily'] },
                { trainNumber: '37349', trainName: 'Howrah - Tarakeswar Night Local (EMU)', source: 'Howrah Junction (HWH)', destination: 'Tarakeswar (TAK)', departureTime: '10:05 PM', arrivalTime: '11:35 PM', runsOn: ['Daily'] },
                { trainNumber: '37347', trainName: 'Howrah - Tarakeswar Local (EMU)', source: 'Howrah Junction (HWH)', destination: 'Tarakeswar (TAK)', departureTime: '10:15 PM', arrivalTime: '11:45 PM', runsOn: ['Daily'] },
                { trainNumber: '37351', trainName: 'Howrah - Tarakeswar Late Night Local (EMU)', source: 'Howrah Junction (HWH)', destination: 'Tarakeswar (TAK)', departureTime: '11:05 PM', arrivalTime: '12:35 AM', runsOn: ['Daily'] }
            ];
        }
        // Sort chronologically by departure time!
        resultList.sort((a, b) => timeToMinutes(a.departureTime) - timeToMinutes(b.departureTime));
        if (apiTrains.length > 0) {
            const emuOnly = apiTrains.filter(t => t.trainName.toLowerCase().includes('local') || t.trainName.toLowerCase().includes('emu') || t.trainNumber.startsWith('3'));
            if (emuOnly.length > 0) {
                emuOnly.sort((a, b) => timeToMinutes(a.departureTime) - timeToMinutes(b.departureTime));
                return emuOnly;
            }
        }
        return resultList;
    }
    const isChennaiBengaluru = ['MAS', 'SBC', 'BNC'].includes(fromCode) && ['MAS', 'SBC', 'BNC'].includes(toCode);
    if (isChennaiBengaluru) {
        const list = [
            { trainNumber: '12007', trainName: 'Mysuru Shatabdi Express', source: 'Chennai Central (MAS)', destination: 'KSR Bengaluru (SBC)', departureTime: '06:00 AM', arrivalTime: '10:55 AM', runsOn: ['Daily'] },
            { trainNumber: '22625', trainName: 'KSR Bengaluru AC Double Decker Express', source: 'Chennai Central (MAS)', destination: 'KSR Bengaluru (SBC)', departureTime: '07:25 AM', arrivalTime: '01:10 PM', runsOn: ['Daily'] },
            { trainNumber: '12639', trainName: 'Brindavan Express', source: 'Chennai Central (MAS)', destination: 'KSR Bengaluru (SBC)', departureTime: '07:50 AM', arrivalTime: '02:00 PM', runsOn: ['Daily'] },
            { trainNumber: '12609', trainName: 'KSR Bengaluru SF Express', source: 'Chennai Central (MAS)', destination: 'KSR Bengaluru (SBC)', departureTime: '01:35 PM', arrivalTime: '08:05 PM', runsOn: ['Daily'] },
            { trainNumber: '12296', trainName: 'Sanghamitra SF Express', source: 'Chennai Central (MAS)', destination: 'KSR Bengaluru (SBC)', departureTime: '01:55 PM', arrivalTime: '08:20 PM', runsOn: ['Daily'] },
            { trainNumber: '12577', trainName: 'Bagmati Express', source: 'Chennai Central (MAS)', destination: 'KSR Bengaluru (SBC)', departureTime: '02:45 PM', arrivalTime: '08:40 PM', runsOn: ['Mon', 'Fri'] },
            { trainNumber: '12607', trainName: 'Lalbagh Express', source: 'Chennai Central (MAS)', destination: 'KSR Bengaluru (SBC)', departureTime: '03:35 PM', arrivalTime: '09:35 PM', runsOn: ['Daily'] },
            { trainNumber: '12657', trainName: 'Chennai - Bengaluru Mail', source: 'Chennai Central (MAS)', destination: 'KSR Bengaluru (SBC)', departureTime: '11:05 PM', arrivalTime: '04:30 AM', runsOn: ['Daily'] }
        ];
        list.sort((a, b) => timeToMinutes(a.departureTime) - timeToMinutes(b.departureTime));
        return list;
    }
    const cleanFrom = fromQuery.trim() || 'Origin';
    const cleanTo = toQuery.trim() || 'Destination';
    if (apiTrains.length > 0) {
        apiTrains.sort((a, b) => timeToMinutes(a.departureTime) - timeToMinutes(b.departureTime));
        return apiTrains;
    }
    return [
        { trainNumber: '12951', trainName: `Tejas Rajdhani Express (${cleanFrom} -> ${cleanTo})`, source: `${cleanFrom} (${fromCode})`, destination: `${cleanTo} (${toCode})`, departureTime: '05:00 PM', arrivalTime: '08:32 AM', runsOn: ['Daily'] },
        { trainNumber: '22436', trainName: `Vande Bharat Express (${cleanFrom} -> ${cleanTo})`, source: `${cleanFrom} (${fromCode})`, destination: `${cleanTo} (${toCode})`, departureTime: '06:00 AM', arrivalTime: '02:00 PM', runsOn: ['Daily'] }
    ];
}
async function getLiveTrainStatus(trainId) {
    const cleanedId = trainId.replace(/\D/g, '') || '37349';
    const trainNum = cleanedId.padStart(5, '0');
    const apiKey = process.env.RAILRADAR_API_KEY || 'rg_ab166db828b7493bb0084338f68545c9';
    const headers = { Authorization: `Bearer ${apiKey}` };
    const masterInfo = LOCAL_TRAINS_MASTER[cleanedId] || LOCAL_TRAINS_MASTER[trainNum];
    const isUpTrain = masterInfo?.isUp ?? false;
    try {
        const [liveRes, detailsRes] = await Promise.allSettled([
            axios_1.default.get(`${RAILRADAR_BASE_URL}/trains/${trainNum}/live`, { headers, timeout: 6000 }),
            axios_1.default.get(`${RAILRADAR_BASE_URL}/trains/${trainNum}`, { headers, timeout: 6000 })
        ]);
        if (liveRes.status === 'fulfilled' && liveRes.value.data?.data) {
            const liveData = liveRes.value.data.data;
            const trainMeta = liveData.train || {};
            const detailsData = detailsRes.status === 'fulfilled' ? detailsRes.value.data?.data : null;
            const coordsMap = new Map();
            if (detailsData && Array.isArray(detailsData.route)) {
                detailsData.route.forEach((st) => {
                    const code = st.stationCode || st.station?.code;
                    if (code && st.station?.lat && st.station?.lng) {
                        coordsMap.set(code, { lat: st.station.lat, lng: st.station.lng });
                    }
                });
            }
            let rawRoute = Array.isArray(liveData.route) && liveData.route.length > 0 ? liveData.route : (detailsData?.route || []);
            const masterRouteList = isUpTrain ? [...HWH_TAK_MASTER_ROUTE].reverse() : HWH_TAK_MASTER_ROUTE;
            if (masterInfo && masterRouteList.length > 0) {
                const rawCodeMap = new Map(rawRoute.map((r) => [r.stationCode || r.station?.code, r]));
                rawRoute = masterRouteList.map((masterSt, idx) => {
                    const existing = rawCodeMap.get(masterSt.code);
                    if (existing)
                        return existing;
                    return {
                        stationCode: masterSt.code,
                        stationName: masterSt.name,
                        platform: masterSt.platform,
                        distance: masterSt.dist,
                        scheduledArrival: idx === 0 ? masterInfo.dep : idx === masterRouteList.length - 1 ? masterInfo.arr : `10:${String(10 + idx).padStart(2, '0')}`,
                        scheduledDeparture: idx === 0 ? masterInfo.dep : idx === masterRouteList.length - 1 ? masterInfo.arr : `10:${String(10 + idx).padStart(2, '0')}`,
                        status: 'upcoming'
                    };
                });
            }
            const totalDist = masterInfo ? 84 : trainMeta.distance || (rawRoute.length > 0 ? Math.round(rawRoute[rawRoute.length - 1].distance || 1000) : 1000);
            const currentCode = liveData.currentLocation?.stationCode || liveData.currentLocation?.station?.code;
            const stations = rawRoute.map((st, idx) => {
                const code = st.stationCode || st.station?.code || `STN-${idx}`;
                const name = st.stationName || st.station?.name || `Station ${code}`;
                const coords = coordsMap.get(code) || {
                    lat: (trainMeta.source?.lat || 22.5828) + (idx * 0.02),
                    lng: (trainMeta.source?.lng || 88.3428) - (idx * 0.02)
                };
                const isCurrentLoc = currentCode ? code === currentCode : (st.status === 'at-station' || st.status === 'current');
                const isPassed = st.status === 'departed' || (!isCurrentLoc && idx < (rawRoute.findIndex((r) => r.stationCode === currentCode || r.status === 'at-station' || r.status === 'current') || 1));
                return {
                    code,
                    name,
                    lat: coords.lat,
                    lng: coords.lng,
                    scheduledArrival: formatTime(st.scheduledArrival || (idx === rawRoute.length - 1 ? masterInfo?.arr : undefined)),
                    scheduledDeparture: formatTime(st.scheduledDeparture || (idx === 0 ? masterInfo?.dep : undefined)),
                    actualArrival: formatTime(st.actualArrival || st.scheduledArrival || (idx === rawRoute.length - 1 ? masterInfo?.arr : undefined)),
                    actualDeparture: formatTime(st.actualDeparture || st.scheduledDeparture || (idx === 0 ? masterInfo?.dep : undefined)),
                    delayMinutes: st.delayMinutes || st.delayDeparture || st.delayArrival || liveData.delayMinutes || 0,
                    platform: st.platform ? String(st.platform) : '1',
                    distanceFromSourceKm: Math.round(st.distance || 0),
                    status: isCurrentLoc ? 'current' : isPassed ? 'passed' : 'upcoming',
                    elevationMeters: 120,
                    weather: getStationWeather(code, idx)
                };
            });
            const hasCurrent = stations.some(s => s.status === 'current');
            if (!hasCurrent && stations.length > 0) {
                const matchIdx = stations.findIndex(s => s.code === currentCode);
                const targetIdx = matchIdx >= 0 ? matchIdx : Math.min(1, stations.length - 1);
                stations[targetIdx].status = 'current';
            }
            const currentIdx = stations.findIndex(s => s.status === 'current');
            const activeCurrentStation = currentIdx >= 0 ? stations[currentIdx] : stations[0];
            const activeNextStation = stations[Math.min(currentIdx >= 0 ? currentIdx + 1 : 1, stations.length - 1)] || activeCurrentStation;
            const distCovered = activeCurrentStation.distanceFromSourceKm;
            const distRemaining = Math.max(totalDist - distCovered, 0);
            const progressPercent = totalDist > 0 ? Math.min(Math.round((distCovered / totalDist) * 100), 100) : 50;
            const routeCoordinates = stations.map(s => [s.lng, s.lat]);
            return {
                trainNumber: cleanedId,
                trainName: masterInfo?.name || liveData.trainName || trainMeta.name || `Train ${cleanedId}`,
                sourceStation: masterInfo?.source || (trainMeta.source?.name ? `${trainMeta.source.name} (${trainMeta.source.code})` : stations[0]?.name || 'Origin'),
                destinationStation: masterInfo?.dest || (trainMeta.destination?.name ? `${trainMeta.destination.name} (${trainMeta.destination.code})` : stations[stations.length - 1]?.name || 'Destination'),
                currentStation: activeCurrentStation,
                nextStation: activeNextStation,
                lastUpdated: liveData.lastUpdatedAt || new Date().toISOString(),
                isStale: Boolean(liveData.isStale),
                delayMinutes: liveData.delayMinutes || activeCurrentStation.delayMinutes || 0,
                speedKmh: trainMeta.avgSpeed || trainMeta.maxSpeed || 45,
                progressPercent,
                distanceCoveredKm: distCovered,
                distanceRemainingKm: distRemaining,
                totalDistanceKm: totalDist,
                currentLat: activeCurrentStation.lat,
                currentLng: activeCurrentStation.lng,
                bearing: 125,
                stations,
                routeCoordinates
            };
        }
    }
    catch (err) {
        console.warn(`RailRadar API call note for ${trainNum}:`, err.message);
    }
    const routeMasterList = isUpTrain ? [...HWH_TAK_MASTER_ROUTE].reverse() : HWH_TAK_MASTER_ROUTE;
    const fallbackStations = routeMasterList.map((masterSt, idx) => ({
        code: masterSt.code,
        name: masterSt.name,
        lat: masterSt.lat,
        lng: masterSt.lng,
        scheduledDeparture: idx === 0 ? masterInfo?.dep || '08:35 PM' : idx === routeMasterList.length - 1 ? masterInfo?.arr || '10:40 PM' : formatTime(`2026-09-01T21:${String(10 + idx * 3).padStart(2, '0')}:00+05:30`),
        scheduledArrival: idx === 0 ? masterInfo?.dep || '08:35 PM' : idx === routeMasterList.length - 1 ? masterInfo?.arr || '10:40 PM' : formatTime(`2026-09-01T21:${String(10 + idx * 3).padStart(2, '0')}:00+05:30`),
        actualDeparture: idx === 0 ? masterInfo?.dep || '08:35 PM' : idx === routeMasterList.length - 1 ? masterInfo?.arr || '10:40 PM' : formatTime(`2026-09-01T21:${String(10 + idx * 3).padStart(2, '0')}:00+05:30`),
        actualArrival: idx === 0 ? masterInfo?.dep || '08:35 PM' : idx === routeMasterList.length - 1 ? masterInfo?.arr || '10:40 PM' : formatTime(`2026-09-01T21:${String(10 + idx * 3).padStart(2, '0')}:00+05:30`),
        delayMinutes: 0,
        platform: masterSt.platform,
        distanceFromSourceKm: masterSt.dist,
        status: idx === routeMasterList.length - 1 ? 'current' : 'passed',
        elevationMeters: 120,
        weather: getStationWeather(masterSt.code, idx)
    }));
    const lastFallbackStn = fallbackStations[fallbackStations.length - 1];
    return {
        trainNumber: cleanedId,
        trainName: masterInfo?.name || `Howrah - Tarakeswar Local (EMU)`,
        sourceStation: masterInfo?.source || 'Goghat (GOGH)',
        destinationStation: masterInfo?.dest || 'Howrah Junction (HWH)',
        currentStation: lastFallbackStn,
        nextStation: lastFallbackStn,
        lastUpdated: new Date().toISOString(),
        isStale: false,
        delayMinutes: 0,
        speedKmh: 42.5,
        progressPercent: 100,
        distanceCoveredKm: masterInfo ? 84 : 57,
        distanceRemainingKm: 0,
        totalDistanceKm: masterInfo ? 84 : 57,
        currentLat: lastFallbackStn.lat,
        currentLng: lastFallbackStn.lng,
        bearing: 125,
        stations: fallbackStations,
        routeCoordinates: fallbackStations.map(s => [s.lng, s.lat])
    };
}
