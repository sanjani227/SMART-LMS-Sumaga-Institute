'use client';

import { Search, Plus, Eye, Pencil, Trash2, Bell } from 'lucide-react';

export default function AnnouncementsPage() {
  const announcements = [
    {
      id: 1,
      title: "End of Term Examinations",
      status: "Published",
      content: "End of term examinations will begin on June 20th. Please ensure all students are prepared.",
      by: "Admin",
      date: "01/06/2025",
      category: "Academic",
      audience: ["Teachers", "Students", "Parents"]
    },
    {
      id: 2,
      title: "Class Cancel",
      status: "Published",
      content: "Parent-Teacher meetings will be held on June 15th from 9:00 AM to 3:00 PM. Attendance is mandatory.",
      by: "Vice Principal Smith",
      date: "28/05/2025",
      category: "General",
      audience: ["Teachers", "Parents"]
    }
  ];

  const stats = [
    { label: "Total Announcements", value: 5, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Published", value: 4, color: "text-green-500", bg: "bg-green-50" },
    { label: "Drafts", value: 1, color: "text-yellow-500", bg: "bg-yellow-50" },
  ];

  return (
    <div className='w-full h-full'>
      <div className='justify-center items-center'>You are on guest mode</div>
    </div>
  );
}
