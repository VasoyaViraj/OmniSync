"use client";

import { Employee } from "../types/employee";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useRouter } from "next/navigation";

interface EmployeeTableProps {
  employees: Employee[];
}

export function EmployeeTable({ employees }: EmployeeTableProps) {
  const router = useRouter();

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600 bg-emerald-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-rose-600 bg-rose-50";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow className="hover:bg-slate-50 border-slate-100">
            <TableHead className="font-semibold text-slate-700">Name</TableHead>
            <TableHead className="font-semibold text-slate-700">Department</TableHead>
            <TableHead className="font-semibold text-slate-700">Role</TableHead>
            <TableHead className="font-semibold text-slate-700 text-center">Engagement</TableHead>
            <TableHead className="font-semibold text-slate-700 text-center">Performance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow 
              key={employee.id} 
              className="hover:bg-slate-50/50 cursor-pointer border-slate-100 transition-colors"
              onClick={() => router.push(`/employees/${employee.id}`)}
            >
              <TableCell className="font-medium text-slate-900 flex items-center gap-3">
                <Avatar className="h-8 w-8 border border-slate-200">
                  <AvatarImage src={`https://i.pravatar.cc/150?u=${employee.id}`} />
                  <AvatarFallback className="bg-slate-100 text-slate-600">{employee.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {employee.name}
              </TableCell>
              <TableCell className="text-slate-600">{employee.department}</TableCell>
              <TableCell className="text-slate-600">{employee.role}</TableCell>
              <TableCell className="text-center">
                <Badge variant="secondary" className={`${getScoreColor(employee.engagementScore)} border-0 hover:${getScoreColor(employee.engagementScore)}`}>
                  {employee.engagementScore}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="secondary" className={`${getScoreColor(employee.performanceScore)} border-0 hover:${getScoreColor(employee.performanceScore)}`}>
                  {employee.performanceScore}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
          {employees.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                No employees found matching your criteria.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
