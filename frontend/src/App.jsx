
export default function Home() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Welcome to School Attendance App</h1>
      <div>
        <div>
          <p>Timetable</p>
          <p>Your upcoming classes and events</p>
        </div>
        <div>

          <div className="bg-muted p-4 rounded-md text-center">
            Google Calendar Timetable will be displayed here
          </div>
        </div>
      </div>
      <div className="flex">

        <div className="flex flex-col gap-3 w-1/4">
          <div className="p-5 border-2  rounded-xl">
            <div>
              <p className="font-bold text-xl">Students</p>
            </div>
            <div>
              <p>Access your attendance records and class schedules.</p>
              <button className="mt-4 py-2 px-3 bg-black text-white rounded-md">Student Login</button>
            </div>
          </div>
          <div className="p-5 border-2  rounded-xl">
            <div>
              <p>Faculty</p>
            </div>
            <div>
              <p>Manage attendance and view class schedules.</p>
              <button className="mt-4">Faculty Login</button>
            </div>
          </div>
          <div className="p-5 border-2  rounded-xl">
            <div>
              <p>Parents</p>
            </div>
            <div>
              <p>Monitor your child's attendance and progress.</p>
              <button className="mt-4">Parent Login</button>
            </div>
          </div>
        </div>
        <div className="calander">

          <iframe src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Asia%2FKolkata&bgcolor=%23ffffff&showTz=0&mode=WEEK&src=YTU4OTgzZmNlMmFjNmVjNDQ2YWU0NGFhYzUyMTg5ZjYwY2NiOWMyMDgzY2RlOTgwZmJhN2Y1ZmJjOTI5YWE2MkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=Y2xhc3Nyb29tMTExNzY2MDY0OTYzNzgyOTg5NjY2QGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20&color=%237CB342&color=%23202124" style={{ border: "solid 1px #777" }} width="800" height="600" frameBorder="0" scrolling="no"></iframe>
        </div>

      </div>
    </div>
  )
}