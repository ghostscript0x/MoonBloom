import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import BottomNav from "@/components/BottomNav";
import { useAppointments, useCreateAppointment, useUpdateAppointment, useDeleteAppointment, useUpcomingAppointments } from "@/hooks/useApi";
import { Calendar, Clock, MapPin, Phone, User, Plus, Edit2, Trash2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Appointment {
  _id: string;
  doctorName: string;
  specialty: string;
  clinicName?: string;
  date: string;
  time: string;
  duration?: number;
  type: string;
  notes?: string;
  location?: {
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    phone?: string;
  };
  reminders?: string[];
  status: string;
}

const AppointmentsScreen = () => {
  const { toast } = useToast();
  const { data: appointments, isLoading } = useAppointments();
  const { data: upcomingAppointments } = useUpcomingAppointments();
  const createAppointmentMutation = useCreateAppointment();
  const updateAppointmentMutation = useUpdateAppointment();
  const deleteAppointmentMutation = useDeleteAppointment();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState({
    doctorName: '',
    specialty: 'gynecologist',
    clinicName: '',
    date: '',
    time: '',
    duration: '30',
    type: 'consultation',
    notes: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    reminders: [] as string[],
  });

  const resetForm = () => {
    setFormData({
      doctorName: '',
      specialty: 'gynecologist',
      clinicName: '',
      date: '',
      time: '',
      duration: '30',
      type: 'consultation',
      notes: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      reminders: [],
    });
    setEditingAppointment(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const appointmentData = {
        doctorName: formData.doctorName,
        specialty: formData.specialty,
        clinicName: formData.clinicName || undefined,
        date: formData.date,
        time: formData.time,
        duration: parseInt(formData.duration),
        type: formData.type,
        notes: formData.notes || undefined,
        location: formData.address || formData.city || formData.state || formData.zipCode || formData.phone ? {
          address: formData.address || undefined,
          city: formData.city || undefined,
          state: formData.state || undefined,
          zipCode: formData.zipCode || undefined,
          phone: formData.phone || undefined,
        } : undefined,
        reminders: formData.reminders.length > 0 ? formData.reminders : undefined,
      };

      if (editingAppointment) {
        await updateAppointmentMutation.mutateAsync({
          id: editingAppointment._id,
          appointmentData,
        });
        toast({
          title: "Appointment Updated",
          description: "Your appointment has been updated successfully.",
        });
      } else {
        await createAppointmentMutation.mutateAsync(appointmentData);
        toast({
          title: "Appointment Created",
          description: "Your appointment has been scheduled successfully.",
        });
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      doctorName: appointment.doctorName,
      specialty: appointment.specialty || 'gynecologist',
      clinicName: appointment.clinicName || '',
      date: new Date(appointment.date).toISOString().split('T')[0],
      time: appointment.time,
      duration: appointment.duration?.toString() || '30',
      type: appointment.type || 'consultation',
      notes: appointment.notes || '',
      address: appointment.location?.address || '',
      city: appointment.location?.city || '',
      state: appointment.location?.state || '',
      zipCode: appointment.location?.zipCode || '',
      phone: appointment.location?.phone || '',
      reminders: appointment.reminders || [],
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (appointmentId: string) => {
    if (confirm('Are you sure you want to delete this appointment?')) {
      try {
        await deleteAppointmentMutation.mutateAsync(appointmentId);
        toast({
          title: "Appointment Deleted",
          description: "Your appointment has been deleted successfully.",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to delete appointment.",
          variant: "destructive",
        });
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'cancelled': return 'text-red-600';
      case 'confirmed': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-24 safe-top flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 safe-top">
      {/* Header */}
      <header className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-display text-foreground">
              Appointments
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your doctor visits
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}
                className="rounded-full w-12 h-12 p-0"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingAppointment ? 'Edit Appointment' : 'Schedule Appointment'}
                </DialogTitle>
                <DialogDescription>
                  {editingAppointment ? 'Update your appointment details' : 'Book a new doctor appointment'}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="doctorName">Doctor Name *</Label>
                    <Input
                      id="doctorName"
                      value={formData.doctorName}
                      onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                      placeholder="Dr. Smith"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Specialty</Label>
                    <Select value={formData.specialty} onValueChange={(value) => setFormData({ ...formData, specialty: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gynecologist">Gynecologist</SelectItem>
                        <SelectItem value="primary-care">Primary Care</SelectItem>
                        <SelectItem value="endocrinologist">Endocrinologist</SelectItem>
                        <SelectItem value="nutritionist">Nutritionist</SelectItem>
                        <SelectItem value="therapist">Therapist</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clinicName">Clinic/Hospital Name</Label>
                  <Input
                    id="clinicName"
                    value={formData.clinicName}
                    onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                    placeholder="Medical Center"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Select value={formData.duration} onValueChange={(value) => setFormData({ ...formData, duration: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 min</SelectItem>
                        <SelectItem value="30">30 min</SelectItem>
                        <SelectItem value="45">45 min</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="90">1.5 hours</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consultation">Consultation</SelectItem>
                        <SelectItem value="follow-up">Follow-up</SelectItem>
                        <SelectItem value="check-up">Check-up</SelectItem>
                        <SelectItem value="procedure">Procedure</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Reason for visit, symptoms to discuss, etc."
                    rows={3}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Location Details</Label>
                  <div className="space-y-2">
                    <Input
                      placeholder="Address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                    <Input
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="ZIP Code"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    />
                    <Input
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={createAppointmentMutation.isPending || updateAppointmentMutation.isPending}>
                  {createAppointmentMutation.isPending || updateAppointmentMutation.isPending ? 'Saving...' : (editingAppointment ? 'Update Appointment' : 'Schedule Appointment')}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Upcoming Appointments */}
      {upcomingAppointments && upcomingAppointments.length > 0 && (
        <section className="px-6 mb-6">
          <h2 className="text-lg font-semibold mb-3 text-foreground">Upcoming (Next 7 Days)</h2>
          <div className="space-y-3">
            {upcomingAppointments.map((appointment: Appointment) => (
              <Card key={appointment._id} className="animate-slide-up">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-primary" />
                        <h3 className="font-medium text-foreground">{appointment.doctorName}</h3>
                        <span className={cn("text-xs px-2 py-1 rounded-full", getStatusColor(appointment.status))}>
                          {appointment.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(appointment.date)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {appointment.time}
                        </div>
                      </div>
                      {appointment.location?.address && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {appointment.location.address}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(appointment)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(appointment._id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* All Appointments */}
      <section className="px-6">
        <h2 className="text-lg font-semibold mb-3 text-foreground">
          All Appointments ({appointments?.length || 0})
        </h2>

        {!appointments || appointments.length === 0 ? (
          <Card className="animate-slide-up">
            <CardContent className="p-8 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No appointments scheduled</h3>
              <p className="text-muted-foreground mb-4">
                Keep track of your doctor visits and medical appointments in one place.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Schedule First Appointment
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {appointments.map((appointment: Appointment) => (
              <Card key={appointment._id} className="animate-slide-up">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-primary" />
                        <h3 className="font-medium text-foreground">{appointment.doctorName}</h3>
                        <span className={cn("text-xs px-2 py-1 rounded-full", getStatusColor(appointment.status))}>
                          {appointment.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(appointment.date)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {appointment.time}
                        </div>
                      </div>
                      {appointment.clinicName && (
                        <p className="text-sm text-muted-foreground mb-1">{appointment.clinicName}</p>
                      )}
                      {appointment.notes && (
                        <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(appointment)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(appointment._id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <BottomNav />
    </div>
  );
};

export default AppointmentsScreen;