"use client";

import { useState } from "react";
import { useEmployees } from "@/hooks/useEmployees";
import { Employee } from "@/types/employee";
import { format } from "date-fns";
import Link from "next/link";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MoreHorizontal, FileUser, UserPlus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function EmployeesPage() {
  const { data: employees, isLoading } = useEmployees();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEmployees = employees?.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.designation.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Employees</h1>
          <p className="text-muted-foreground mt-1">
            Manage your organization's talent and view unified profiles.
          </p>
        </div>
        <Button className="shrink-0 gap-2">
          <UserPlus className="h-4 w-4" />
          Add Employee
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name, role, department..."
                className="pl-9 bg-slate-50/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="text-sm font-medium text-muted-foreground ml-auto">
              {filteredEmployees.length} employees found
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="w-[250px] pl-6">Name & Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Sentiment Score</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="pl-6"><Skeleton className="h-10 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="text-right pr-6"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No employees found matching "{searchTerm}"
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((emp) => (
                  <TableRow key={emp.id} className="hover:bg-slate-50/50 group transition-colors">
                    <TableCell className="pl-6 py-4">
                      <div className="flex flex-col space-y-0.5">
                        <Link href={`/employees/${emp.id}`} className="font-semibold text-slate-900 hover:text-primary hover:underline group-hover:text-primary transition-colors">
                          {emp.name}
                        </Link>
                        <span className="text-xs text-muted-foreground">{emp.designation}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal bg-slate-100">
                        {emp.department}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-600">{emp.location}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${emp.engagement_score >= 8 ? 'bg-emerald-500' : emp.engagement_score >= 6 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${(emp.engagement_score / 10) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-slate-600">{emp.engagement_score}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600 text-sm">
                      {format(new Date(emp.created_at), 'MMM yyyy')}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Link 
                        href={`/employees/${emp.id}`}
                        className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-medium hover:bg-muted hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <FileUser className="h-4 w-4 mr-2" /> View
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
