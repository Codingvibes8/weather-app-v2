import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun } from "lucide-react"
import type { JSX } from "react"

interface ForecastDisplayProps {
  forecastData: any
  loading: boolean
}

/**
 * A component to display a 5-day weather forecast in a grid of cards.
 *
 * @param {ForecastDisplayProps} props
 * @param {any} props.forecastData - The forecast data from the API.
 * @param {boolean} props.loading - Whether the data is still loading.
 * @returns {JSX.Element} A component displaying the forecast data.
 */
export default function ForecastDisplay({ forecastData, loading }: ForecastDisplayProps) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 md:p-6">
          <div className="h-8 w-1/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="px-4 md:px-6 pb-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-36 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const getWeatherIcon = (iconCode: string) => {
    const iconMap: Record<string, JSX.Element> = {
      "01d": <Sun className="h-10 w-10 text-yellow-500" />,
      "01n": <Sun className="h-10 w-10 text-yellow-400" />,
      "02d": <Cloud className="h-10 w-10 text-gray-400" />,
      "02n": <Cloud className="h-10 w-10 text-gray-400" />,
      "03d": <Cloud className="h-10 w-10 text-gray-400" />,
      "03n": <Cloud className="h-10 w-10 text-gray-400" />,
      "04d": <Cloud className="h-10 w-10 text-gray-500" />,
      "04n": <Cloud className="h-10 w-10 text-gray-500" />,
      "09d": <CloudDrizzle className="h-10 w-10 text-blue-400" />,
      "09n": <CloudDrizzle className="h-10 w-10 text-blue-400" />,
      "10d": <CloudRain className="h-10 w-10 text-blue-500" />,
      "10n": <CloudRain className="h-10 w-10 text-blue-500" />,
      "11d": <CloudLightning className="h-10 w-10 text-yellow-600" />,
      "11n": <CloudLightning className="h-10 w-10 text-yellow-600" />,
      "13d": <CloudSnow className="h-10 w-10 text-blue-200" />,
      "13n": <CloudSnow className="h-10 w-10 text-blue-200" />,
      "50d": <CloudFog className="h-10 w-10 text-gray-300" />,
      "50n": <CloudFog className="h-10 w-10 text-gray-300" />,
    }

    return iconMap[iconCode] || <Cloud className="h-10 w-10 text-gray-400" />
  }

  // Get daily forecast (one forecast per day)
  const dailyForecasts = forecastData.list.filter((item: any, index: number) => index % 8 === 0).slice(0, 5)

  const formatDay = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString("en-US", { weekday: "short" })
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-100">5-Day Forecast</h2>
      </div>
      <div className="px-4 md:px-6 pb-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {dailyForecasts.map((forecast: any, index: number) => {
            const temp = Math.round(forecast.main.temp)
            const iconCode = forecast.weather[0].icon
            const description = forecast.weather[0].description
            const day = formatDay(forecast.dt)

            return (
              <div key={index} className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                <div className="p-4 flex flex-col items-center">
                  <p className="font-medium text-lg text-gray-800 dark:text-gray-200">{day}</p>
                  <div className="my-2">{getWeatherIcon(iconCode)}</div>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-50">{temp}°C</p>
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400 capitalize">{description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

