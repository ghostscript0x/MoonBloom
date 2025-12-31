import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BottomNav from "@/components/BottomNav";
import MoodSelector from "@/components/MoodSelector";
import SymptomToggle from "@/components/SymptomToggle";
import SyncIndicator from "@/components/SyncIndicator";
import { useCreateCycle } from "@/hooks/useApi";
import { Droplets, Save, Check, X, Pill, Battery, Moon, Heart, Thermometer, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type TabType = "mood" | "symptoms" | "health" | "period";

const LogScreen = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const createCycleMutation = useCreateCycle();
  
  const [activeTab, setActiveTab] = useState<TabType>(
    (searchParams.get("tab") as TabType) || "mood"
  );
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [periodStarted, setPeriodStarted] = useState<boolean | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // New health tracking states
  const [painIntensity, setPainIntensity] = useState<number[]>([0]);
  const [energyLevel, setEnergyLevel] = useState<number[]>([5]);
  const [sleepQuality, setSleepQuality] = useState<string>("");
  const [temperature, setTemperature] = useState<string>("");
  const [temperatureError, setTemperatureError] = useState<string>("");
  const [medications, setMedications] = useState<string[]>([]);
  const [supplements, setSupplements] = useState<string[]>([]);

  // Progressive disclosure for health tab
  const [expandedHealthSections, setExpandedHealthSections] = useState<Set<string>>(new Set());

  const toggleHealthSection = (section: string) => {
    const newExpanded = new Set(expandedHealthSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedHealthSections(newExpanded);
  };

  // Helper component for expandable health sections
  const ExpandableSection = ({
    title,
    icon,
    section,
    children,
    isExpanded,
    onToggle
  }: {
    title: string;
    icon: React.ReactNode;
    section: string;
    children: React.ReactNode;
    isExpanded: boolean;
    onToggle: () => void;
  }) => (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium">{title}</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
  const [waterIntake, setWaterIntake] = useState<number[]>([0]);
  const [exercise, setExercise] = useState<string>("");

  useEffect(() => {
    const tab = searchParams.get("tab") as TabType;
    if (tab && ["mood", "symptoms", "period", "health"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Temperature validation
  const validateTemperature = (value: string): boolean => {
    if (!value) return true; // Empty is valid
    const temp = parseFloat(value);
    return !isNaN(temp) && temp >= 95 && temp <= 105;
  };

  const handleTemperatureChange = (value: string) => {
    setTemperature(value);
    if (value && !validateTemperature(value)) {
      setTemperatureError("Please enter a temperature between 95°F and 105°F");
    } else {
      setTemperatureError("");
    }
  };

  // Sanitize medication/supplement input
  const parseListInput = (input: string): string[] => {
    return input
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0 && item.length <= 50) // Prevent overly long items
      .filter((item, index, arr) => arr.indexOf(item) === index); // Remove duplicates
  };



  const handleSymptomToggle = (symptomId: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId)
        ? prev.filter((s) => s !== symptomId)
        : [...prev, symptomId]
    );
  };

  const handleSave = async () => {
    if (isSaving) return; // Prevent double submission

    setIsSaving(true);

    try {
      const cycleData: {
        date: string | Date;
        phase: string;
        flow?: string;
        symptoms?: string[];
        mood?: string;
        notes?: string;
        painIntensity?: number;
        energyLevel?: number;
        sleepQuality?: string;
        temperature?: number;
        waterIntake?: number;
        exercise?: string;
        medications?: string[];
        supplements?: string[];
      } = {
        date: new Date(), // Send as Date object
        phase: 'follicular', // Default phase for general logging
        notes: notes || undefined,
      };

      // Add data based on active tab
      if (activeTab === "mood" && selectedMood) {
        // Map mood values to API format
        const moodMapping: { [key: string]: string } = {
          'great': 'happy',
          'good': 'energetic',
          'okay': 'tired',
          'low': 'sad',
          'bad': 'irritable'
        };
        cycleData.mood = moodMapping[selectedMood] || selectedMood;
      }

      if (activeTab === "symptoms" && selectedSymptoms.length > 0) {
        cycleData.symptoms = selectedSymptoms;
      }

      if (activeTab === "health") {
        // Add health metrics
        if (painIntensity[0] > 0) {
          cycleData.painIntensity = painIntensity[0];
        }
        if (energyLevel[0] !== 5) { // Only save if not default
          cycleData.energyLevel = energyLevel[0];
        }
        if (sleepQuality) {
          cycleData.sleepQuality = sleepQuality;
        }
        if (temperature) {
          cycleData.temperature = parseFloat(temperature);
        }
        if (waterIntake[0] > 0) {
          cycleData.waterIntake = waterIntake[0];
        }
        if (exercise) {
          cycleData.exercise = exercise;
        }
        if (medications.length > 0) {
          cycleData.medications = medications;
        }
        if (supplements.length > 0) {
          cycleData.supplements = supplements;
        }
      }

      if (activeTab === "period") {
        if (periodStarted === true) {
          cycleData.phase = 'menstrual';
          cycleData.flow = 'medium'; // Default flow
        } else if (periodStarted === false) {
          cycleData.phase = 'follicular'; // Period ended, moving to next phase
        }
      }

      // Ensure phase is always valid
      const validPhases = ['menstrual', 'follicular', 'ovulation', 'luteal'];
      if (!validPhases.includes(cycleData.phase)) {
        console.error('Invalid phase detected:', cycleData.phase, 'Setting to follicular');
        cycleData.phase = 'follicular'; // Fallback to safe default
      }

      console.log('Saving cycle data:', cycleData); // Debug log

      await createCycleMutation.mutateAsync(cycleData);

      toast({
        title: "Saved! 💕",
        description: "Your log has been saved.",
      });

      // Reset form based on active tab
      if (activeTab === "mood") {
        setSelectedMood(null);
      }
      if (activeTab === "symptoms") {
        setSelectedSymptoms([]);
      }
      if (activeTab === "health") {
        setPainIntensity([0]);
        setEnergyLevel([5]);
        setSleepQuality("");
        setTemperature("");
        setWaterIntake([0]);
        setExercise("");
        setMedications([]);
        setSupplements([]);
      }
      if (activeTab === "period") {
        setPeriodStarted(null);
      }
      setNotes("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your log. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "mood" as const, label: "Mood" },
    { id: "symptoms" as const, label: "Symptoms" },
    { id: "health" as const, label: "Health" },
    { id: "period" as const, label: "Period" },
  ];

  const canSave =
    (activeTab === "mood" && selectedMood) ||
    (activeTab === "symptoms" && selectedSymptoms.length > 0) ||
    (activeTab === "health" && (painIntensity[0] > 0 || energyLevel[0] !== 5 || sleepQuality || (temperature && !temperatureError) || medications.length > 0 || supplements.length > 0 || waterIntake[0] > 0 || exercise)) ||
    (activeTab === "period" && periodStarted !== null);

  return (
    <div className="min-h-screen bg-background pb-24 safe-top">
      {/* Header */}
      <header className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold font-display text-foreground">
            Log today
          </h1>
          <SyncIndicator showLabel />
        </div>
        <p className="text-muted-foreground mt-1">
          Take a moment to check in with yourself 💗
        </p>
      </header>

      {/* Tabs */}
      <div className="px-6 mb-6">
        <div className="flex gap-2 p-1 bg-muted rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200",
                activeTab === tab.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <main className="px-6 space-y-6">
        {activeTab === "mood" && (
          <Card variant="glass" className="animate-fade-in">
            <CardHeader>
              <CardTitle className="text-lg">How are you feeling?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <MoodSelector
                selectedMood={selectedMood}
                onMoodSelect={setSelectedMood}
                size="lg"
              />
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Add a note (optional)
                </label>
                <Textarea
                  placeholder="What's on your mind today?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "symptoms" && (
          <Card variant="glass" className="animate-fade-in">
            <CardHeader>
              <CardTitle className="text-lg">Any symptoms today?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <SymptomToggle
                selectedSymptoms={selectedSymptoms}
                onSymptomToggle={handleSymptomToggle}
              />
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Additional notes (optional)
                </label>
                <Textarea
                  placeholder="Anything else you want to remember?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "health" && (
          <Card variant="glass" className="animate-fade-in">
            <CardHeader>
              <CardTitle className="text-lg">Health & Wellness</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quick Health Metrics */}
              <ExpandableSection
                title="Physical Health"
                icon={<Heart className="w-4 h-4 text-destructive" />}
                section="physical"
                isExpanded={expandedHealthSections.has("physical")}
                onToggle={() => toggleHealthSection("physical")}
              >
                <div className="space-y-4">
                  {/* Pain Intensity */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">
                      Pain Intensity (0-10)
                    </label>
                    <div className="px-2">
                      <Slider
                        value={painIntensity}
                        onValueChange={setPainIntensity}
                        max={10}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>No pain</span>
                        <span className="font-medium">Level: {painIntensity[0]}</span>
                        <span>Severe pain</span>
                      </div>
                    </div>
                  </div>

                  {/* Energy Level */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">
                      Energy Level (1-10)
                    </label>
                    <div className="px-2">
                      <Slider
                        value={energyLevel}
                        onValueChange={setEnergyLevel}
                        min={1}
                        max={10}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Exhausted</span>
                        <span className="font-medium">Level: {energyLevel[0]}</span>
                        <span>Energetic</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ExpandableSection>

              {/* Sleep & Temperature */}
              <ExpandableSection
                title="Sleep & Temperature"
                icon={<Moon className="w-4 h-4 text-blue-500" />}
                section="sleep"
                isExpanded={expandedHealthSections.has("sleep")}
                onToggle={() => toggleHealthSection("sleep")}
              >
                <div className="space-y-4">
                  {/* Sleep Quality */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Sleep Quality
                    </label>
                    <Select value={sleepQuality} onValueChange={setSleepQuality}>
                      <SelectTrigger>
                        <SelectValue placeholder="How did you sleep?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                        <SelectItem value="terrible">Terrible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Temperature */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Basal Temperature (°F)
                    </label>
                    <div className="space-y-1">
                      <input
                        type="number"
                        step="0.1"
                        min="95"
                        max="105"
                        placeholder="97.8"
                        value={temperature}
                        onChange={(e) => handleTemperatureChange(e.target.value)}
                        className={cn(
                          "w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-offset-2",
                          temperatureError
                            ? "border-destructive focus:ring-destructive"
                            : "border-input focus:ring-ring"
                        )}
                      />
                      {temperatureError && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {temperatureError}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </ExpandableSection>

              {/* Nutrition & Exercise */}
              <ExpandableSection
                title="Nutrition & Exercise"
                icon={<Battery className="w-4 h-4 text-primary" />}
                section="nutrition"
                isExpanded={expandedHealthSections.has("nutrition")}
                onToggle={() => toggleHealthSection("nutrition")}
              >
                <div className="space-y-4">
                  {/* Water Intake */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">
                      Water Intake (glasses)
                    </label>
                    <div className="px-2">
                      <Slider
                        value={waterIntake}
                        onValueChange={setWaterIntake}
                        max={12}
                        step={1}
                        className="w-full"
                      />
                      <div className="text-center text-xs text-muted-foreground mt-1">
                        <span className="font-medium">{waterIntake[0]} glasses</span>
                      </div>
                    </div>
                  </div>

                  {/* Exercise */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Exercise/Activity
                    </label>
                    <Select value={exercise} onValueChange={setExercise}>
                      <SelectTrigger>
                        <SelectValue placeholder="Did you exercise today?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No exercise</SelectItem>
                        <SelectItem value="light">Light activity</SelectItem>
                        <SelectItem value="moderate">Moderate exercise</SelectItem>
                        <SelectItem value="intense">Intense workout</SelectItem>
                        <SelectItem value="yoga">Yoga/Meditation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </ExpandableSection>

              {/* Medications & Supplements */}
              <ExpandableSection
                title="Medications & Supplements"
                icon={<Pill className="w-4 h-4 text-green-500" />}
                section="medications"
                isExpanded={expandedHealthSections.has("medications")}
                onToggle={() => toggleHealthSection("medications")}
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Medications Taken
                    </label>
                    <Textarea
                      placeholder="List any medications you took today..."
                      value={medications.join(', ')}
                      onChange={(e) => setMedications(parseListInput(e.target.value))}
                      className="min-h-[60px] resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Supplements/Vitamins
                    </label>
                    <Textarea
                      placeholder="List any supplements you took today..."
                      value={supplements.join(', ')}
                      onChange={(e) => setSupplements(parseListInput(e.target.value))}
                      className="min-h-[60px] resize-none"
                    />
                  </div>
                </div>
              </ExpandableSection>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Additional Notes
                </label>
                <Textarea
                  placeholder="Any other health observations..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "period" && (
          <Card variant="glass" className="animate-fade-in">
            <CardHeader>
              <CardTitle className="text-lg">Period update</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <button
                  onClick={() => setPeriodStarted(true)}
                  className={cn(
                    "flex-1 flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-200",
                    periodStarted === true
                      ? "bg-period-light border-period shadow-soft"
                      : "bg-muted/50 border-transparent hover:bg-muted"
                  )}
                >
                  <div className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center",
                    periodStarted === true ? "bg-period" : "bg-muted"
                  )}>
                    <Droplets className={cn(
                      "w-7 h-7",
                      periodStarted === true ? "text-primary-foreground" : "text-muted-foreground"
                    )} />
                  </div>
                  <div className="text-center">
                    <p className={cn(
                      "font-medium",
                      periodStarted === true ? "text-period" : "text-foreground"
                    )}>
                      Started
                    </p>
                    <p className="text-xs text-muted-foreground">My period began</p>
                  </div>
                </button>

                <button
                  onClick={() => setPeriodStarted(false)}
                  className={cn(
                    "flex-1 flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-200",
                    periodStarted === false
                      ? "bg-fertile-light border-fertile shadow-soft"
                      : "bg-muted/50 border-transparent hover:bg-muted"
                  )}
                >
                  <div className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center",
                    periodStarted === false ? "bg-fertile" : "bg-muted"
                  )}>
                    <Check className={cn(
                      "w-7 h-7",
                      periodStarted === false ? "text-primary-foreground" : "text-muted-foreground"
                    )} />
                  </div>
                  <div className="text-center">
                    <p className={cn(
                      "font-medium",
                      periodStarted === false ? "text-fertile" : "text-foreground"
                    )}>
                      Ended
                    </p>
                    <p className="text-xs text-muted-foreground">My period ended</p>
                  </div>
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Notes (optional)
                </label>
                <Textarea
                  placeholder="How are you feeling about your cycle?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Save Button */}
        <Button
          variant="cozy"
          size="xl"
          className="w-full"
          disabled={!canSave || isSaving}
          onClick={handleSave}
        >
          <Save className="w-5 h-5" />
          {isSaving ? "Saving..." : "Save log"}
        </Button>

        {/* Empty state hint */}
        {!canSave && (
          <p className="text-center text-sm text-muted-foreground">
            Select something above to save your log
          </p>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default LogScreen;
