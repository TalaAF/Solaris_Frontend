import React from "react";
import SecurityPolicy from "../../admin/SecurityPolicy";
import AuditLog from "../../admin/AuditLog";
import { ShieldCheck } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../ui/tabs";
import "./Security.css";

const Security = () => {
  return (
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
      
      <Tabs defaultValue="policies">
        <TabsList>
          <TabsTrigger value="policies">Security Policies</TabsTrigger>
          <TabsTrigger value="auditlog">Audit Log</TabsTrigger>
        </TabsList>
        
        <TabsContent value="policies">
          <SecurityPolicy />
        </TabsContent>
        <TabsContent value="auditlog">
          <AuditLog />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Security;