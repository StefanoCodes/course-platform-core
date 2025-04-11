import { TabsContent } from "@radix-ui/react-tabs";
import { motion } from "motion/react";
import { FeatureCard } from "../ui/feature-card";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { LaptopMockup } from "../ui/laptop-mockup";

export default function HowItWorks() {
    return (
        <motion.section
        id="how-it-works"
        className="py-8 px-4"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
          <div className="max-w-7xl mx-auto w-full">
            {/* section title */}
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 text-center">
                How It Works
            </h2>
            
            <LaptopMockup>
              <Tabs defaultValue="teacher" className="w-full h-full relative">
                <TabsList className="w-full sticky top-0 z-20 bg-white">
                  <TabsTrigger value="teacher">
                    Teacher
                  </TabsTrigger>
                  <TabsTrigger value="student">
                    Student
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="teacher" className="h-[calc(100%)] overflow-hidden">
                  <div className="flex flex-col gap-4 p-4">
                    <Tabs defaultValue="teacher-step-1" className="w-full">
                      <TabsList className="w-full sticky top-0 z-20 bg-white">
                        <TabsTrigger value="teacher-step-1">Step 1</TabsTrigger>
                        <TabsTrigger value="teacher-step-2">Step 2</TabsTrigger>
                        <TabsTrigger value="teacher-step-3">Step 3</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="teacher-step-1">
                        <FeatureCard 
                          image="/images/marketing/admin-login-screenshot.png"
                          heading="Step 1: Login"
                          description="Login to your account to get started."
                        />
                      </TabsContent>
                      
                      <TabsContent value="teacher-step-2">
                        <FeatureCard 
                          image="/path-to-screenshot-2.jpg"
                          heading="Step 2: Browse Courses"
                          description="Explore our wide range of courses tailored to your interests. Filter by difficulty, duration, and topic to find the perfect match."
                        />
                      </TabsContent>
                      
                      <TabsContent value="teacher-step-3">
                        <FeatureCard 
                          image="/path-to-screenshot-3.jpg"
                          heading="Step 3: Learn & Track Progress"
                          description="Engage with interactive lessons, complete assignments, and track your progress. Earn certificates as you master new skills."
                        />
                      </TabsContent>
                    </Tabs>
                  </div>
                </TabsContent>
                <TabsContent value="student" className="h-[calc(100%-40px)] overflow-hidden">
                  <div className="flex flex-col gap-4 p-4">
                    <Tabs defaultValue="student-step-1" className="w-full">
                      <TabsList className="w-full sticky top-0 z-20 bg-white">
                        <TabsTrigger value="student-step-1">Step 1</TabsTrigger>
                        <TabsTrigger value="student-step-2">Step 2</TabsTrigger>
                        <TabsTrigger value="student-step-3">Step 3</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="student-step-1">
                        <FeatureCard 
                          image="/images/marketing/student-login-screenshot.png"
                          heading="Step 1: Login"
                          description="Login to your account to get started."
                        />
                      </TabsContent>
                      
                      <TabsContent value="student-step-2">
                        <FeatureCard 
                          image="/path-to-screenshot-2.jpg"
                          heading="Step 2: Browse Courses"
                          description="Explore our wide range of courses tailored to your interests. Filter by difficulty, duration, and topic to find the perfect match."
                        />
                      </TabsContent>
                      
                      <TabsContent value="student-step-3">
                        <FeatureCard 
                          image="/path-to-screenshot-3.jpg"
                          heading="Step 3: Learn & Track Progress"
                          description="Engage with interactive lessons, complete assignments, and track your progress. Earn certificates as you master new skills."
                        />
                      </TabsContent>
                    </Tabs>
                  </div>
                </TabsContent>
              </Tabs>
            </LaptopMockup>
          </div>
      </motion.section>
    )
}
