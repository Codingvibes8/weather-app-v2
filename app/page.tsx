"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import WeatherDisplay from "@/components/weather-display"
import ForecastDisplay from "@/components/forecast-display"
import { useDebounce } from "@/hooks/use-debounce"
import Navbar from "@/components/Navbar"

interface Location {
  name: string
  lat: number
  lon: number
}

export default function WeatherApp() {
  const [searchQuery, setSearchQuery] = useState("")
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedLocation, setSelectedLocation] = useState<Location>({ name: "London, UK", lat: 51.5074, lon: -0.1278 })
  const [weatherData, setWeatherData] = useState<any>(null)
  const [forecastData, setForecastData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  // Fetch location suggestions from Mapbox
  useEffect(() => {
    const fetchLocations = async () => {
      if (debouncedSearchQuery.length < 2) {
        setLocations([])
        return
      }

      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(debouncedSearchQuery)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}&types=place`,
        )
        const data = await response.json()

        const formattedLocations = data.features.map((feature: any) => ({
          name: feature.place_name,
          lat: feature.center[1],
          lon: feature.center[0],
        }))

        setLocations(formattedLocations)
        setShowSuggestions(true)
      } catch (error) {
        console.error("Error fetching locations:", error)
        setLocations([])
      }
    }

    if (debouncedSearchQuery) {
      fetchLocations()
    }
  }, [debouncedSearchQuery])

  // Fetch weather data for selected location
  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true)
      try {
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${selectedLocation.lat}&lon=${selectedLocation.lon}&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`,
        )
        const weatherResult = await weatherResponse.json()

        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${selectedLocation.lat}&lon=${selectedLocation.lon}&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`,
        )
        const forecastResult = await forecastResponse.json()

        setWeatherData(weatherResult)
        setForecastData(forecastResult)
      } catch (error) {
        console.error("Error fetching weather data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWeatherData()
  }, [selectedLocation])

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location)
    setSearchQuery("")
    setShowSuggestions(false)
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 md:p-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">Weather Forecast</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Check the current weather and forecast for any location
              </p>
            </div>
            <div className="px-4 md:px-6 pb-6">
              <div className="relative">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search for a location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setShowSuggestions(true)}
                      className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    />
                    <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                  <button
                    onClick={() => setShowSuggestions(false)}
                    className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                </div>

                {showSuggestions && locations.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-md border border-gray-200 dark:border-gray-700">
                    <ul className="max-h-64 overflow-auto">
                      {locations.map((location, index) => (
                        <li
                          key={index}
                          className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                          onClick={() => handleLocationSelect(location)}
                        >
                          {location.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {weatherData && (
            <WeatherDisplay weatherData={weatherData} locationName={selectedLocation.name} loading={loading} />
          )}

          {forecastData && <ForecastDisplay forecastData={forecastData} loading={loading} />}
        </div>
      </main>
    </>
  )
}

