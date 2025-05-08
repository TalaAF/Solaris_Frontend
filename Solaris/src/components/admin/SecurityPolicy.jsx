import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Shield, AlertTriangle } from "lucide-react";
import { Switch } from "../ui/switch";

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
		<div className="space-y-6 security-policy-container">
			{/* Security Warning Alert */}
			<div className="security-warning">
				<AlertTriangle className="security-warning-icon" size={20} />
				<div className="security-warning-content">
					<h3>Security Warning</h3>
					<p >
						Changes to security policies may affect all users in the system. Review changes carefully before
						applying.
					</p>
				</div>
			</div>

			{/* Security Policies Card */}
			<Card>
				<CardHeader>
					<CardTitle>Security Policies</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{policies.map((policy) => (
							<div key={policy.id} className="policy-item">
								<div className="policy-info">
									<div className="policy-header">
										<Shield className="policy-icon" />
										<h3 className="policy-name">{policy.name}</h3>
									</div>
									<p className="policy-description">{policy.description}</p>
									<p className="policy-timestamp">
										Last updated: {new Date(policy.lastUpdated).toLocaleString()}
									</p>
								</div>
								<Switch
									checked={policy.isEnabled}
									onCheckedChange={() => handlePolicyToggle(policy.id)}
								/>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Add New Policy Card */}
			<Card>
				<CardHeader>
					<CardTitle>Add New Security Policy</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="form-group">
						<Label htmlFor="policy-name" className="form-label">
							Policy Name
						</Label>
						<Input
							id="policy-name"
							value={newPolicy.name}
							onChange={(e) => setNewPolicy({ ...newPolicy, name: e.target.value })}
							placeholder="Enter policy name"
							className="form-input"
						/>
					</div>

					<div className="form-group">
						<Label htmlFor="policy-description" className="form-label">
							Description
						</Label>
						<Textarea
							id="policy-description"
							value={newPolicy.description}
							onChange={(e) => setNewPolicy({ ...newPolicy, description: e.target.value })}
							placeholder="Enter policy description"
							className="form-textarea"
						/>
					</div>

					<div className="policy-switch-row">
						<Switch
							id="policy-enabled"
							checked={newPolicy.isEnabled}
							onCheckedChange={() => setNewPolicy({ ...newPolicy, isEnabled: !newPolicy.isEnabled })}
						/>
						<Label htmlFor="policy-enabled" className="policy-switch-label">
							Enable policy immediately
						</Label>
					</div>

					<Button onClick={handleAddPolicy} className="add-policy-btn">
						Add Policy
					</Button>
				</CardContent>
			</Card>
		</div>
	);
};

export default SecurityPolicy;