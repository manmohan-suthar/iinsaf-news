import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { LocateFixed, MapPin } from 'lucide-react'
import { saveUserLocation } from '../../store/authSlice'
import { reverseLocation } from './locationApi'

function LocationPrompt() {
  const dispatch = useDispatch()
  const [location, setLocation] = useState('')
  const [locationParts, setLocationParts] = useState({
    city: '',
    district: '',
    locality: '',
    pincode: '',
    state: '',
  })
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  function resetLocationParts() {
    setLocationParts({
      city: '',
      district: '',
      locality: '',
      pincode: '',
      state: '',
    })
  }

  function requestBrowserLocation() {
    if (!navigator.geolocation) {
      setError('आपके ब्राउज़र में लोकेशन सपोर्ट नहीं है। कृपया नीचे अपना शहर लिखें।')
      return
    }

    setStatus('detecting')
    setError('')

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const nextLatitude = Number(position.coords.latitude.toFixed(6))
        const nextLongitude = Number(position.coords.longitude.toFixed(6))

        try {
          const resolvedLocation = await reverseLocation({
            latitude: nextLatitude,
            longitude: nextLongitude,
          })

          setLatitude(nextLatitude)
          setLongitude(nextLongitude)
          setLocation(resolvedLocation.location)
          setLocationParts({
            city: resolvedLocation.city || '',
            district: resolvedLocation.district || '',
            locality: resolvedLocation.locality || '',
            pincode: resolvedLocation.pincode || '',
            state: resolvedLocation.state || '',
          })
          setStatus('idle')
        } catch {
          setLatitude(nextLatitude)
          setLongitude(nextLongitude)
          setLocation('')
          resetLocationParts()
          setStatus('idle')
          setError('लोकेशन का नाम नहीं मिला। कृपया अपना गांव/शहर और जिला लिखें।')
        }
      },
      () => {
        setStatus('idle')
        setError('लोकेशन अनुमति नहीं मिली। कृपया अपना शहर या इलाका लिखें।')
      },
      {
        enableHighAccuracy: true,
        maximumAge: 60000,
        timeout: 10000,
      },
    )
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const manualLocation = [
      locationParts.locality,
      locationParts.city,
      locationParts.district,
      locationParts.state,
    ]
      .filter(Boolean)
      .join(', ')
    const finalLocation = location.trim() || `${manualLocation}${locationParts.pincode ? ` ${locationParts.pincode}` : ''}`.trim()

    if (!finalLocation) {
      setError('कृपया अपनी लोकेशन लिखें या लोकेशन बटन दबाएं।')
      return
    }

    setStatus('saving')
    setError('')

    try {
      await dispatch(
        saveUserLocation({
          latitude,
          ...locationParts,
          location: finalLocation,
          longitude,
        }),
      ).unwrap()
    } catch {
      setError('लोकेशन सेव नहीं हुई। कृपया दोबारा कोशिश करें।')
      setStatus('idle')
    }
  }

  return (
    <section className="fixed inset-0 z-[80] grid place-items-center bg-black/45 px-4" aria-label="Location prompt">
      <form className="w-full max-w-sm rounded-[30px] bg-white p-5 shadow-2xl" onSubmit={handleSubmit}>
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-[#f5e8df] text-[#c5222f]">
          <MapPin aria-hidden="true" size={30} strokeWidth={2.5} />
        </div>

        <div className="mt-5 text-center">
          <p className="text-xs font-extrabold uppercase tracking-wide text-[#c5222f]">आपकी लोकेशन</p>
          <h2 className="mt-2 text-2xl font-black leading-tight text-[#111827]">अपना शहर या इलाका बताएं</h2>
          <p className="mt-3 text-sm font-semibold leading-6 text-[#667085]">
            इससे आपकी प्रोफाइल में लोकेशन दिखेगी और लोकल न्यूज़ बेहतर मिलेगी।
          </p>
        </div>

        <button
          className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#111827] px-4 text-sm font-extrabold text-white disabled:bg-[#8a8f98]"
          disabled={status === 'detecting' || status === 'saving'}
          onClick={requestBrowserLocation}
          type="button"
        >
          <LocateFixed aria-hidden="true" size={18} strokeWidth={2.5} />
          {status === 'detecting' ? 'लोकेशन ढूंढ रहे हैं...' : 'मेरी लोकेशन इस्तेमाल करें'}
        </button>

        <label className="mt-4 grid gap-2">
          <span className="text-sm font-extrabold text-[#111827]">पूरी लोकेशन</span>
          <input
            className="min-h-12 rounded-2xl border border-[#dedbd2] bg-[#fbfbf8] px-4 text-sm font-bold text-[#111827] outline-none focus:border-[#c5222f]"
            onChange={(event) => {
              setLocation(event.target.value)
              setLatitude(null)
              setLongitude(null)
              resetLocationParts()
              setError('')
            }}
            placeholder="जैसे: मिठनपुरा, ऐलनाबाद, सिरसा 125102"
            type="text"
            value={location}
          />
        </label>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <input
            className="min-h-11 rounded-2xl border border-[#dedbd2] bg-[#fbfbf8] px-3 text-sm font-bold text-[#111827] outline-none focus:border-[#c5222f]"
            onChange={(event) => {
              setLocationParts((current) => ({ ...current, locality: event.target.value }))
              setLocation('')
              setLatitude(null)
              setLongitude(null)
              setError('')
            }}
            placeholder="गांव / इलाका"
            type="text"
            value={locationParts.locality}
          />
          <input
            className="min-h-11 rounded-2xl border border-[#dedbd2] bg-[#fbfbf8] px-3 text-sm font-bold text-[#111827] outline-none focus:border-[#c5222f]"
            onChange={(event) => {
              setLocationParts((current) => ({ ...current, city: event.target.value }))
              setLocation('')
              setLatitude(null)
              setLongitude(null)
              setError('')
            }}
            placeholder="शहर / तहसील"
            type="text"
            value={locationParts.city}
          />
          <input
            className="min-h-11 rounded-2xl border border-[#dedbd2] bg-[#fbfbf8] px-3 text-sm font-bold text-[#111827] outline-none focus:border-[#c5222f]"
            onChange={(event) => {
              setLocationParts((current) => ({ ...current, district: event.target.value }))
              setLocation('')
              setLatitude(null)
              setLongitude(null)
              setError('')
            }}
            placeholder="जिला"
            type="text"
            value={locationParts.district}
          />
          <input
            className="min-h-11 rounded-2xl border border-[#dedbd2] bg-[#fbfbf8] px-3 text-sm font-bold text-[#111827] outline-none focus:border-[#c5222f]"
            onChange={(event) => {
              setLocationParts((current) => ({ ...current, pincode: event.target.value }))
              setLocation('')
              setLatitude(null)
              setLongitude(null)
              setError('')
            }}
            placeholder="पिनकोड"
            type="text"
            value={locationParts.pincode}
          />
          <input
            className="col-span-2 min-h-11 rounded-2xl border border-[#dedbd2] bg-[#fbfbf8] px-3 text-sm font-bold text-[#111827] outline-none focus:border-[#c5222f]"
            onChange={(event) => {
              setLocationParts((current) => ({ ...current, state: event.target.value }))
              setLocation('')
              setLatitude(null)
              setLongitude(null)
              setError('')
            }}
            placeholder="राज्य"
            type="text"
            value={locationParts.state}
          />
        </div>

        {error ? <p className="mt-3 text-sm font-bold leading-5 text-[#c5222f]">{error}</p> : null}

        <button
          className="mt-5 min-h-12 w-full rounded-2xl bg-[#c5222f] px-4 text-sm font-black text-white disabled:bg-[#d8d2c8]"
          disabled={status === 'saving'}
          type="submit"
        >
          {status === 'saving' ? 'सेव हो रहा है...' : 'लोकेशन सेव करें'}
        </button>
      </form>
    </section>
  )
}

export default LocationPrompt
