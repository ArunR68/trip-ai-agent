import requests

WEATHER_CODE_MAP = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    51: 'Light drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    80: 'Rain showers',
    95: 'Thunderstorm',
}

KNOWN_COORDS = {
    'ooty': {'lat': 11.4064, 'lon': 76.6932, 'temp': 18},
    'coimbatore': {'lat': 11.0168, 'lon': 76.9558, 'temp': 29},
    'munnar': {'lat': 10.0889, 'lon': 77.0595, 'temp': 19},
    'wayanad': {'lat': 11.6854, 'lon': 76.1320, 'temp': 22},
    'pondicherry': {'lat': 11.9416, 'lon': 79.8083, 'temp': 30},
    'coorg': {'lat': 12.3375, 'lon': 75.8069, 'temp': 21},
    'chennai': {'lat': 13.0827, 'lon': 80.2707, 'temp': 32},
    'bangalore': {'lat': 12.9716, 'lon': 77.5946, 'temp': 26},
}

def get_live_weather(location_name: str) -> dict:
    norm = location_name.lower().strip()
    lat, lon = 11.4064, 76.6932

    for key, data in KNOWN_COORDS.items():
        if key in norm or norm in key:
            lat = data['lat']
            lon = data['lon']
            break

    try:
        url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto"
        res = requests.get(url, timeout=4)
        if res.status_code == 200:
            payload = res.json()
            current = payload.get('current', {})
            daily = payload.get('daily', {})
            w_code = current.get('weather_code', 1)
            temp = round(current.get('temperature_2m', 22))

            forecast = []
            days = ['Today', 'Tomorrow', 'Day 3', 'Day 4']
            for i in range(min(4, len(daily.get('time', [])))):
                forecast.append({
                    'day': days[i],
                    'tempMin': round(daily.get('temperature_2m_min', [15])[i]),
                    'tempMax': round(daily.get('temperature_2m_max', [24])[i]),
                    'condition': WEATHER_CODE_MAP.get(daily.get('weather_code', [0])[i], 'Pleasant'),
                })

            return {
                'location': location_name,
                'temperature': temp,
                'condition': WEATHER_CODE_MAP.get(w_code, 'Pleasant'),
                'weatherCode': w_code,
                'humidity': current.get('relative_humidity_2m', 65),
                'windSpeed': current.get('wind_speed_10m', 10),
                'rainProbability': (daily.get('precipitation_probability_max') or [10])[0],
                'forecast': forecast,
                'isLive': True,
                'advisory': 'Great weather for sightseeing! Pack light woolens for mountain evenings.' if temp < 20 else 'Pleasant daytime weather.'
            }
    except Exception as e:
        print(f"Weather error: {e}")

    return {
        'location': location_name,
        'temperature': 20,
        'condition': 'Pleasant',
        'weatherCode': 1,
        'humidity': 60,
        'windSpeed': 10,
        'rainProbability': 15,
        'forecast': [],
        'isLive': False,
        'advisory': 'Estimated pleasant weather.'
    }
