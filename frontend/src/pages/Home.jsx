
export default function Home() {
  return (
    <div className="space-y-2 bg-gray-200 min-h-screen">

      <div className="flex">


        <div className="calander w-full h-[80vh] p-2 sm:p-6">
          <iframe src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Asia%2FKolkata&mode=WEEK&showTz=0&showCalendars=0&src=YjJiNzQ4YjI2ZmM1ZTI3MmY5N2JiOTMwYTgyNTZmZmUwMjRhMDQ4ODU3ZDJmNDI2NjA1YjRiZGFkZDliMDhmMEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23009688"
            style={{ border: 0 }}
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
          ></iframe>
        </div>

      </div>
    </div>
  )
}