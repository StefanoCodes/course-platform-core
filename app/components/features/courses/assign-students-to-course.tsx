
import { X } from "lucide-react";
import * as React from "react";

import { Command as CommandPrimitive } from "cmdk";
import { useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useFetcher } from "react-router";
import { Badge } from "~/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import type { Student } from "~/db/schema";
import type { CreateCourseSchema } from "~/lib/admin/zod-schemas/course";


type FetcherResponse = {
  students: Student[];
}
export function AssignStudentToCourse({form}: {form: UseFormReturn<CreateCourseSchema>}) {
  const fetcher = useFetcher<FetcherResponse>();
  const [students,setStudents] = useState<Student[] | []>([]);
  const [isLoading,setIsLoading] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Student[]>([]);
  const [inputValue, setInputValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const isDataLoaded = students.length > 0;
    if(!isDataLoaded) {
    fetcher.load("/resource/students-all");
    if (fetcher.data) {
      const { students } = fetcher.data;
        setIsLoading(false);
        setStudents(students);
      }
    }
  }, [fetcher.data]);

  const handleUnselect = React.useCallback((student: Student) => {
    setSelected((prev) => prev.filter((s) => s.id !== student.studentId));
    // attach the ids of the selected students to the form
    form.setValue("students", form.getValues("students").filter((s) => s !== student.studentId));
  }, []);

  const handleSelectAll = React.useCallback(() => {
  setSelected(() => students.map((student) => student))
// setting the react hook form state to have all the student ids
form.setValue("students", students.map((student) => student.studentId))
  }, [])

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            setSelected((prev) => {
              const newSelected = [...prev];
              newSelected.pop();
              return newSelected;
            });
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    [],
  );

  const selectables = students.filter(
    (student) => !selected.includes(student),
  );
  
  return (
    <div>
      {isLoading ? <div>Loading...</div> : <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selected.map((student) => {
            return (
              <Badge key={student.studentId} variant="secondary">
                {student.name}
                <button
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(student);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(student)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder="Select students..."
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative mt-2">
        <CommandList>
          <button type="button" onClick={handleSelectAll}>Select all students</button>
          {open && selectables.length > 0 ? (
            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-full overflow-auto">
                {selectables.map((student) => {
                  return (
                    <CommandItem
                      key={student.studentId}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={(value) => {
                        setInputValue("");
                        setSelected((prev) => [...prev, student]);
                        form.setValue("students", [...form.getValues("students"), student.studentId]);

                      }}
                      className={"cursor-pointer"}
                    >
                      {student.name}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          ) : null}
        </CommandList>
      </div>
    </Command> }
    </div>
    
  );
}