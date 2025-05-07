import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert"; // Updated import
import { Switch } from "../../components/ui/switch"; // Add the switch component
import { Shield, AlertTriangle } from "lucide-react";

// Default security policies
const defaultPolicies = [
	{
		id: 1,
		name: "Two-Factor Authentication",
		description: "Require users to use two-factor authentication for account access",
		isEnabled: false,
		lastUpdated: new Date().toISOString(),
	},
	{
		id: 2,
		name: "Password Complexity",
		description: "Enforce strong password requirements (min 8 chars, uppercase, lowercase, numbers, special chars)",
		isEnabled: true,
		lastUpdated: new Date().toISOString(),
	},
	{
		id: 3,
		name: "Session Timeout",
		description: "Automatically log out inactive users after 30 minutes",
		isEnabled: true,
		lastUpdated: new Date().toISOString(),
	},
	{
		id: 4,
		name: "IP Restriction",
		description: "Restrict access to specific IP addresses or ranges",
		isEnabled: false,
		lastUpdated: new Date().toISOString(),
	},
	{
		id: 5,
		name: "Failed Login Lockout",
		description: "Lock account after 5 failed login attempts",
		isEnabled: true,
		lastUpdated: new Date().toISOString(),
	},
];

const SecurityPolicy = () => {
	const [policies, setPolicies] = useState(defaultPolicies);
	const [newPolicy, setNewPolicy] = useState({
		name: "",
		description: "",
		isEnabled: false,
	});

	const handlePolicyToggle = (policyId) => {
		setPolicies(
			policies.map((policy) => {
				if (policy.id === policyId) {
					return {
						...policy,
						isEnabled: !policy.isEnabled,
						lastUpdated: new Date().toISOString(),
					};
				}
				return policy;
			})
		);

		const policyName = policies.find((p) => p.id === policyId)?.name;
		const action = policies.find((p) => p.id === policyId)?.isEnabled ? "disabled" : "enabled";
		alert(`${policyName} ${action}`);
	};

	const handleAddPolicy = () => {
		if (!newPolicy.name.trim()) {
			alert("Policy name is required");
			return;
		}

		const newPolicyItem = {
			id: Math.max(0, ...policies.map((p) => p.id)) + 1,
			name: newPolicy.name,
			description: newPolicy.description,
			isEnabled: newPolicy.isEnabled,
			lastUpdated: new Date().toISOString(),
		};

		setPolicies([...policies, newPolicyItem]);
		setNewPolicy({
			name: "",
			description: "",
			isEnabled: false,
		});

		alert("New security policy added");
	};

	return (
		<div className="space-y-6">
			<Alert variant="destructive">
				<AlertTriangle className="h-4 w-4" />
				<AlertTitle>Security Warning</AlertTitle>
				<AlertDescription>
					Changes to security policies may affect all users in the system. Review changes carefully before applying.
				</AlertDescription>
			</Alert>

			<Card>
				<CardHeader>
					<CardTitle>Security Policies</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{policies.map((policy) => (
							<div key={policy.id} className="flex items-center justify-between p-4 border rounded-md">
								<div className="flex-1">
									<div className="flex items-center gap-2">
										<Shield className="h-4 w-4 text-primary" />
										<h3 className="font-medium">{policy.name}</h3>
									</div>
									<p className="text-sm text-muted-foreground mt-1">{policy.description}</p>
									<p className="text-xs text-muted-foreground mt-2">
										Last updated: {new Date(policy.lastUpdated).toLocaleString()}
									</p>
								</div>
								<Switch
									checked={policy.isEnabled}
									onCheckedChange={() => handlePolicyToggle(policy.id)}
									aria-label={`Toggle ${policy.name}`}
								/>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Add New Security Policy</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="policy-name">Policy Name</Label>
							<Input
								id="policy-name"
								value={newPolicy.name}
								onChange={(e) => setNewPolicy({ ...newPolicy, name: e.target.value })}
								placeholder="Enter policy name"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="policy-description">Description</Label>
							<Textarea
								id="policy-description"
								value={newPolicy.description}
								onChange={(e) => setNewPolicy({ ...newPolicy, description: e.target.value })}
								placeholder="Enter policy description"
							/>
						</div>

						<div className="flex items-center space-x-2">
							<Switch
								id="policy-enabled"
								checked={newPolicy.isEnabled}
								onCheckedChange={() => setNewPolicy({ ...newPolicy, isEnabled: !newPolicy.isEnabled })}
							/>
							<Label htmlFor="policy-enabled">Enable policy immediately</Label>
						</div>

						<Button onClick={handleAddPolicy}>Add Policy</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default SecurityPolicy;