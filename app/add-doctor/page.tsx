import AddDoctorForm from "@/components/add-doctor-form"

export default function AddDoctorPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-8 text-center">Add New Doctor</h1>
        <AddDoctorForm />
      </div>
    </main>
  )
}
