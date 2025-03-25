import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun } from "lucide-react"
import type { JSX } from "react"

interface WeatherDisplayProps {
  weatherData: any
  locationName: string
  loading: boolean
}

export default function WeatherDisplay({ weatherData, locationName, loading }: WeatherDisplayProps) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 md:p-6">
          <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="px-4 md:px-6 pb-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              <div>
                <div className="h-12 w-32 mb-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6 md:mt-0">
              <div className="h-20 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-20 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-20 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-20 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const getWeatherIcon = (iconCode: string) => {
    const iconMap: Record<string, JSX.Element> = {
      "01d": <Sun className="h-16 w-16 text-yellow-500" />,
      "01n": <Sun className="h-16 w-16 text-yellow-400" />,
      "02d": <Cloud className="h-16 w-16 text-gray-400" />,
      "02n": <Cloud className="h-16 w-16 text-gray-400" />,
      "03d": <Cloud className="h-16 w-16 text-gray-400" />,
      "03n": <Cloud className="h-16 w-16 text-gray-400" />,
      "04d": <Cloud className="h-16 w-16 text-gray-500" />,
      "04n": <Cloud className="h-16 w-16 text-gray-500" />,
      "09d": <CloudDrizzle className="h-16 w-16 text-blue-400" />,
      "09n": <CloudDrizzle className="h-16 w-16 text-blue-400" />,
      "10d": <CloudRain className="h-16 w-16 text-blue-500" />,
      "10n": <CloudRain className="h-16 w-16 text-blue-500" />,
      "11d": <CloudLightning className="h-16 w-16 text-yellow-600" />,
      "11n": <CloudLightning className="h-16 w-16 text-yellow-600" />,
      "13d": <CloudSnow className="h-16 w-16 text-blue-200" />,
      "13n": <CloudSnow className="h-16 w-16 text-blue-200" />,
      "50d": <CloudFog className="h-16 w-16 text-gray-300" />,
      "50n": <CloudFog className="h-16 w-16 text-gray-300" />,
    }

    return iconMap[iconCode] || <Cloud className="h-16 w-16 text-gray-400" />
  }

  const temp = Math.round(weatherData.main.temp)
  const feelsLike = Math.round(weatherData.main.feels_like)
  const humidity = weatherData.main.humidity
  const windSpeed = Math.round(weatherData.wind.speed)
  const description = weatherData.weather[0].description
  const iconCode = weatherData.weather[0].icon

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-100">{locationName}</h2>
      </div>
      <div className="px-4 md:px-6 pb-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            {getWeatherIcon(iconCode)}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-50">{temp}°C</h2>
              <p className="text-gray-500 dark:text-gray-400 capitalize">{description}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6 md:mt-0">
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Feels Like</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-gray-50">{feelsLike}°C</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Humidity</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-gray-50">{humidity}%</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Wind</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-gray-50">{windSpeed} m/s</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Pressure</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-gray-50">{weatherData.main.pressure} hPa</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

