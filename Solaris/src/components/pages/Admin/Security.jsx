import React, { useState } from "react";
import SecurityPolicy from "../../admin/SecurityPolicy";
import AuditLog from "../../admin/AuditLog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { ShieldCheck } from "lucide-react";
import "./Security.css";

const Security = () => {
  const [activeTab, setActiveTab] = useState("policies");
  
  return (
    <>
      <div className="security-container">
        <div className="security-header">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h1 className="admin-title">Security Management</h1>
          </div>
          <p className="admin-subtitle">
            Manage security policies, review audit logs, and configure system security settings
          </p>
        </div>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="policies">Security Policies</TabsTrigger>
            <TabsTrigger value="auditlog">Audit Log</TabsTrigger>
          </TabsList>
          
          <TabsContent value="policies" className="mt-6">
            <SecurityPolicy />
          </TabsContent>
          
          <TabsContent value="auditlog" className="mt-6">
            <AuditLog />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Security;