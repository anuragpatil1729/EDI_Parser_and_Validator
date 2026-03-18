from typing import Dict, List


def generate_response(issue_codes: List[str]) -> Dict:
    if not issue_codes:
        return {
            "answer": "I do not see validation errors. If a payer still rejects, verify payer companion guide rules.",
            "next_steps": [
                "Confirm submitter/receiver IDs.",
                "Validate against payer companion guide.",
                "Re-submit and track acknowledgement (999/277CA).",
            ],
        }

    first = issue_codes[0]
    return {
        "answer": f"The claim is likely rejected due to {first}. Fix the referenced segment, then re-run validation before resubmission.",
        "next_steps": [
            "Open the listed segment index/location in the viewer.",
            "Apply the suggested fix from the error table.",
            "Re-validate and ensure error count is zero.",
        ],
    }
