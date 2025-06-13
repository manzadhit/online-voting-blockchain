const tabs = document.querySelectorAll(".admin-tab");
const tabContents = document.querySelectorAll(".tab-content");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    // Remove active class from all tabs
    tabs.forEach((t) => t.classList.remove("active"));
    tabContents.forEach((content) => content.classList.remove("active"));

    // Add active class to clicked tab
    tab.classList.add("active");

    // Show corresponding content
    const tabId = tab.getAttribute("data-tab");
    document.getElementById(`${tabId}-tab`).classList.add("active");
  });
});

// Function to display response message
function showMessage(elementId, message, isSuccess) {
  const responseDiv = document.getElementById(elementId);
  responseDiv.textContent = message;
  responseDiv.className = isSuccess
    ? "response-message success-message"
    : "response-message error-message";
  responseDiv.style.display = "block";

  // Hide message after 5 seconds
  setTimeout(() => {
    responseDiv.style.display = "none";
  }, 5000);
}

// Load existing data when page loads
$(document).ready(async function () {
  try {
    // Fetch all elections
    const electionsResponse = await fetch("http://localhost:3000/elections");
    const electionsResult = await electionsResponse.json();

    if (!electionsResponse.ok) {
      throw new Error("Failed to fetch elections");
    }

    // Clear existing options and add new ones
    $("#electionId").empty();
    $("#elections-table tbody").empty();

    electionsResult.data.forEach((election) => {
      const startDate = new Date(election.startDate);
      const endDate = new Date(election.endDate);
      const formattedStartDate = startDate.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      const formattedEndDate = endDate.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      // Add to elections dropdown
      $("#electionId").append(
        `<option value="${election.id}">${election.name}</option>`
      );

      // Add to elections table
      const statusBadge = election.isActive
        ? '<span class="badge badge-success">Aktif</span>'
        : '<span class="badge badge-secondary">Tidak Aktif</span>';

      const newRow = `
        <tr data-id="${election.id}">
          <td>${election.name}</td>
          <td>${formattedStartDate}</td>
          <td>${formattedEndDate}</td>
          <td>${statusBadge}</td>
          <td>
            <div class="action-buttons">
              <button class="btn btn-small btn-edit">Edit</button>
              <button class="btn btn-small btn-delete" onclick="deleteElection('${election.id}')">Hapus</button>
            </div>
          </td>
        </tr>
      `;
      $("#elections-table tbody").append(newRow);
    });

    // Fetch all candidates
    const candidatesResponse = await fetch("http://localhost:3000/candidates");
    const candidatesResult = await candidatesResponse.json();

    if (!candidatesResponse.ok) {
      throw new Error("Failed to fetch candidates");
    }

    $("#candidates-table tbody").empty();

    for (const candidate of candidatesResult.data) {
      const newRow = `
          <tr data-id="${candidate.id}">
            <td>${candidate.mainName} (${candidate.mainInitials})<br><small>${candidate.mainFaculty}</small></td>
            <td>${candidate.deputyName} (${candidate.deputyInitials})<br><small>${candidate.deputyFaculty}</small></td>
            <td>${candidate.election.name}</td>  
            <td>
              <div class="action-buttons">
                <button class="btn btn-small btn-edit">Edit</button>
                <button class="btn btn-small btn-delete" onclick="deleteCandidate('${candidate.id}')">Hapus</button>
              </div>
            </td>
          </tr>
        `;
      $("#candidates-table tbody").append(newRow);
    }

    // Fetch all students
    const studentsResponse = await fetch("http://localhost:3000/students");
    const studentsResult = await studentsResponse.json();

    if (!studentsResponse.ok) {
      throw new Error("Failed to fetch students");
    }

    $("#students-table tbody").empty();

    studentsResult.data.forEach((student) => {
      const newRow = `
        <tr data-id="${student.nim}">
          <td>${student.nim}</td>
          <td>${student.name}</td>
          <td>${student.faculty}</td>
          <td>
            <div class="action-buttons">
              <button class="btn btn-small btn-edit">Edit</button>
              <button class="btn btn-small btn-delete" onclick="deleteStudent('${student.nim}')">Hapus</button>
            </div>
          </td>
        </tr>
      `;
      $("#students-table tbody").append(newRow);
    });
  } catch (error) {
    console.error("Error loading data:", error);
    showMessage("candidate-response", "Gagal mengambil data", false);
  }
});

// Delete functions
async function deleteCandidate(id) {
  if (confirm("Apakah Anda yakin ingin menghapus kandidat ini?")) {
    try {
      const response = await fetch(`http://localhost:3000/candidates/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to delete candidate");
      }

      showMessage("candidate-response", "Kandidat berhasil dihapus", true);
      $(`#candidates-table tr[data-id="${id}"]`).remove();
    } catch (error) {
      showMessage("candidate-response", "Gagal menghapus kandidat", false);
    }
  }
}

async function deleteElection(id) {
  if (
    confirm(
      "Apakah Anda yakin ingin menghapus pemilihan ini? Semua kandidat terkait juga akan dihapus."
    )
  ) {
    try {
      const response = await fetch(`http://localhost:3000/elections/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to delete election");
      }

      showMessage("election-response", "Pemilihan berhasil dihapus", true);
      $(`#elections-table tr[data-id="${id}"]`).remove();
      $(`#electionId option[value="${id}"]`).remove();

      // Refresh candidates table as some may have been deleted
      await refreshCandidatesList();
    } catch (error) {
      showMessage("election-response", "Gagal menghapus pemilihan", false);
    }
  }
}

async function deleteStudent(id) {
  if (confirm("Apakah Anda yakin ingin menghapus mahasiswa ini?")) {
    try {
      const response = await fetch(`http://localhost:3000/students/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to delete student");
      }

      showMessage("student-response", "Mahasiswa berhasil dihapus", true);
      $(`#students-table tr[data-id="${id}"]`).remove();
    } catch (error) {
      showMessage("student-response", "Gagal menghapus mahasiswa", false);
    }
  }
}

// Edit functionality for Candidates
$(document).on("click", "#candidates-tab .btn-edit", async function () {
  const row = $(this).closest("tr");
  const candidateId = parseInt(row.attr("data-id")); // Convert to integer

  try {
    // Get candidate data from the server
    const response = await fetch(
      `http://localhost:3000/candidates/${candidateId}`
    );
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch candidate data");
    }

    const candidate = result.data;

    // Populate form with existing data
    $("#mainName").val(candidate.mainName);
    $("#mainInitials").val(candidate.mainInitials);
    $("#mainFaculty").val(candidate.mainFaculty);
    $("#deputyName").val(candidate.deputyName);
    $("#deputyInitials").val(candidate.deputyInitials);
    $("#deputyFaculty").val(candidate.deputyFaculty);
    $("#vision").val(candidate.vision);
    $("#electionId").val(candidate.electionId);

    // Change form button to update mode
    const submitBtn = $('#add-candidate-form button[type="submit"]');
    submitBtn.text("Update Kandidat");
    submitBtn.attr("data-id", candidateId);
    submitBtn.attr("data-mode", "edit");

    // Scroll to form
    $("html, body").animate(
      {
        scrollTop: $("#add-candidate-form").offset().top - 100,
      },
      500
    );
  } catch (error) {
    showMessage(
      "candidate-response",
      "Gagal mendapatkan data kandidat",
      false
    );
  }
});

// Fixed candidate form submission - handles both create and edit in one handler
$("#add-candidate-form").submit(async function (e) {
  e.preventDefault();

  const submitBtn = $(this).find('button[type="submit"]');
  const mode = submitBtn.attr("data-mode") || "create";
  const candidateId = parseInt(submitBtn.attr("data-id")) || null; // Convert to integer

  // Collect form data with proper integer conversion
  const candidateData = {
    mainName: $("#mainName").val(),
    mainInitials: $("#mainInitials").val(),
    mainFaculty: $("#mainFaculty").val(),
    deputyName: $("#deputyName").val(),
    deputyInitials: $("#deputyInitials").val(),
    deputyFaculty: $("#deputyFaculty").val(),
    vision: $("#vision").val(),
    electionId: parseInt($("#electionId").val()), // Convert to integer
  };

  try {
    let response, result;

    // Handle based on mode
    if (mode === "edit" && candidateId) {
      // Update existing candidate
      response = await fetch(
        `http://localhost:3000/candidates/${candidateId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(candidateData),
        }
      );

      result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update candidate");
      }

      showMessage(
        "candidate-response",
        "Kandidat berhasil diupdate",
        true
      );
    } else {
      // Create new candidate
      response = await fetch("http://localhost:3000/candidates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(candidateData),
      });

      result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create candidate");
      }

      showMessage("candidate-response", "Kandidat berhasil dibuat", true);
    }

    // Reset form and button state
    $("#add-candidate-form")[0].reset();
    submitBtn.text("Tambah Kandidat");
    submitBtn.removeAttr("data-id");
    submitBtn.removeAttr("data-mode");

    // Refresh the candidates list
    await refreshCandidatesList();
  } catch (error) {
    showMessage("candidate-response", error.message, false);
  }
});

// Helper function to refresh candidates list
async function refreshCandidatesList() {
  try {
    const response = await fetch("http://localhost:3000/candidates");
    const result = await response.json();

    if (!response.ok) {
      throw new Error("Failed to fetch candidates");
    }

    $("#candidates-table tbody").empty();

    for (const candidate of result.data) {
      try {
        const electionResponse = await fetch(
          `http://localhost:3000/elections/${candidate.electionId}`
        );
        const electionResult = await electionResponse.json();
        await addCandidateToTable(candidate, electionResult.data.name);
      } catch (error) {
        // If election not found, just show candidate with unknown election
        await addCandidateToTable(candidate, "Unknown");
      }
    }
  } catch (error) {
    console.error("Error refreshing candidates:", error);
  }
}

// Helper function to add a candidate to the table
async function addCandidateToTable(candidate, electionName) {
  const newRow = `
<tr data-id="${candidate.id}">
<td>${candidate.mainName} (${candidate.mainInitials})<br><small>${
    candidate.mainFaculty
  }</small></td>
<td>${candidate.deputyName} (${candidate.deputyInitials})<br><small>${
    candidate.deputyFaculty
  }</small></td>
<td>${electionName || $("#electionId option:selected").text()}</td>
<td>${candidate.voteCount || 0}</td>
<td>
<div class="action-buttons">
  <button class="btn btn-small btn-edit">Edit</button>
  <button class="btn btn-small btn-delete" onclick="deleteCandidate(${
    candidate.id
  })">Hapus</button>
</div>
</td>
</tr>
`;
  $("#candidates-table tbody").append(newRow);
}

// Edit functionality for Elections
$(document).on("click", "#elections-tab .btn-edit", async function () {
  const row = $(this).closest("tr");
  const electionId = parseInt(row.attr("data-id")); // Convert to integer

  try {
    // Get election data from the server
    const response = await fetch(
      `http://localhost:3000/elections/${electionId}`
    );
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch election data");
    }

    const election = result.data;

    // Format dates for form inputs (YYYY-MM-DDThh:mm)
    const startDate = new Date(election.startDate);
    const endDate = new Date(election.endDate);

    const formattedStartDate = startDate.toISOString().slice(0, 16);
    const formattedEndDate = endDate.toISOString().slice(0, 16);

    // Populate form with existing data
    $("#electionName").val(election.name);
    $("#startDate").val(formattedStartDate);
    $("#endDate").val(formattedEndDate);
    $("#isActive").val(election.isActive.toString());

    // Change form button to update mode
    const submitBtn = $('#add-election-form button[type="submit"]');
    submitBtn.text("Update Pemilihan");
    submitBtn.attr("data-id", electionId);
    submitBtn.attr("data-mode", "edit");

    // Scroll to form
    $("html, body").animate(
      {
        scrollTop: $("#add-election-form").offset().top - 100,
      },
      500
    );
  } catch (error) {
    showMessage(
      "election-response",
      "Gagal mendapatkan data pemilihan",
      false
    );
  }
});

// Fixed election form submission - handles both create and edit in one handler
$("#add-election-form").submit(async function (e) {
  e.preventDefault();

  const submitBtn = $(this).find('button[type="submit"]');
  const mode = submitBtn.attr("data-mode") || "create";
  const electionId = parseInt(submitBtn.attr("data-id")) || null; // Convert to integer

  // Format dates properly
  const startDateTime = new Date($("#startDate").val()).toISOString();
  const endDateTime = new Date($("#endDate").val()).toISOString();

  // Collect form data
  const electionData = {
    name: $("#electionName").val(),
    startDate: startDateTime,
    endDate: endDateTime,
    isActive: $("#isActive").val() === "true",
  };

  try {
    let response, result;

    // Handle based on mode
    if (mode === "edit" && electionId) {
      // Update existing election
      response = await fetch(
        `http://localhost:3000/elections/${electionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(electionData),
        }
      );

      result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update election");
      }

      showMessage(
        "election-response",
        "Pemilihan berhasil diupdate",
        true
      );
    } else {
      // Create new election
      response = await fetch("http://localhost:3000/elections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(electionData),
      });

      result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create election");
      }

      showMessage("election-response", "Election berhasil dibuat", true);

      // Add to dropdown
      $("#electionId").append(
        `<option value="${result.data.id}">${result.data.name}</option>`
      );
    }

    // Reset form and button state
    $("#add-election-form")[0].reset();
    submitBtn.text("Tambah Pemilihan");
    submitBtn.removeAttr("data-id");
    submitBtn.removeAttr("data-mode");

    // Refresh the elections list
    await refreshElectionsList();
  } catch (error) {
    showMessage("election-response", error.message, false);
  }
});

// Helper function to refresh elections list
async function refreshElectionsList() {
  try {
    const response = await fetch("http://localhost:3000/elections");
    const result = await response.json();

    if (!response.ok) {
      throw new Error("Failed to fetch elections");
    }

    // Clear existing data
    $("#electionId").empty();
    $("#elections-table tbody").empty();

    // Add each election to table and dropdown
    for (const election of result.data) {
      await addElectionToTable(election);
      $("#electionId").append(
        `<option value="${election.id}">${election.name}</option>`
      );
    }
  } catch (error) {
    console.error("Error refreshing elections:", error);
  }
}

// Helper function to add an election to the table
async function addElectionToTable(election) {
  // Format dates for display
  const startDate = new Date(election.startDate);
  const endDate = new Date(election.endDate);
  const formattedStartDate = startDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedEndDate = endDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Create status badge
  const statusBadge = election.isActive
    ? '<span class="badge badge-success">Aktif</span>'
    : '<span class="badge badge-secondary">Tidak Aktif</span>';

  // Create row
  const newRow = `
  <tr data-id="${election.id}">
    <td>${election.name}</td>
    <td>${formattedStartDate}</td>
    <td>${formattedEndDate}</td>
    <td>${statusBadge}</td>
    <td>
      <div class="action-buttons">
        <button class="btn btn-small btn-edit">Edit</button>
        <button class="btn btn-small btn-delete" onclick="deleteElection(${election.id})">Hapus</button>
      </div>
    </td>
  </tr>
`;
  $("#elections-table tbody").append(newRow);
}

// Edit functionality for Students
$(document).on("click", "#students-tab .btn-edit", async function () {
  const row = $(this).closest("tr");
  const nim = row.attr("data-id"); // Keep as string for NIM

  try {
    // Get student data from the server
    const response = await fetch(`http://localhost:3000/students/${nim}`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch student data");
    }

    const student = result.data;

    // Populate form with existing data
    $("#nim").val(student.nim);
    $("#nama").val(student.name);
    $("#faculty").val(student.faculty);
    // Note: Not setting password field as typically you wouldn't display existing passwords

    // Change form button to update mode
    const submitBtn = $('#add-student-form button[type="submit"]');
    submitBtn.text("Update Mahasiswa");
    submitBtn.attr("data-id", student.nim);
    submitBtn.attr("data-mode", "edit");

    // Add note about password
    if (!$("#password-note").length) {
      $("#password").after(
        '<p id="password-note" style="color:#666;font-size:0.8em;margin-top:5px;">Biarkan kosong jika tidak ingin mengubah password</p>'
      );
    }

    // Scroll to form
    $("html, body").animate(
      {
        scrollTop: $("#add-student-form").offset().top - 100,
      },
      500
    );
  } catch (error) {
    showMessage(
      "student-response",
      "Gagal mendapatkan data mahasiswa",
      false
    );
  }
});

// Fixed student form submission - handles both create and edit in one handler
$("#add-student-form").submit(async function (e) {
  e.preventDefault();

  const submitBtn = $(this).find('button[type="submit"]');
  const mode = submitBtn.attr("data-mode") || "create";
  const origNim = submitBtn.attr("data-id"); // Keep as string for NIM

  // Collect form data
  const studentData = {
    nim: $("#nim").val(),
    name: $("#nama").val(),
    faculty: $("#faculty").val(),
  };

  // Only include password if it's not empty
  if ($("#password").val().trim() !== "") {
    studentData.password = $("#password").val();
  }

  try {
    let response, result;

    // Handle based on mode
    if (mode === "edit" && origNim) {
      // Update existing student
      response = await fetch(
        `http://localhost:3000/students/${origNim}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(studentData),
        }
      );

      result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update student");
      }

      showMessage(
        "student-response",
        "Mahasiswa berhasil diupdate",
        true
      );
      $("#password-note").remove();
    } else {
      // Add new student - need to ensure password is provided
      if (!studentData.password) {
        throw new Error(
          "Password diperlukan untuk membuat mahasiswa baru"
        );
      }

      response = await fetch("http://localhost:3000/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      });

      result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create student");
      }

      showMessage("student-response", "Mahasiswa berhasil dibuat", true);
    }

    // Reset form and button state
    $("#add-student-form")[0].reset();
    submitBtn.text("Tambah Mahasiswa");
    submitBtn.removeAttr("data-id");
    submitBtn.removeAttr("data-mode");

    // Refresh students list
    await refreshStudentsList();
  } catch (error) {
    showMessage("student-response", error.message, false);
  }
});

// Helper function to refresh students list
async function refreshStudentsList() {
  try {
    const response = await fetch("http://localhost:3000/students");
    const result = await response.json();

    if (!response.ok) {
      throw new Error("Failed to fetch students");
    }

    $("#students-table tbody").empty();

    for (const student of result.data) {
      await addStudentToTable(student);
    }
  } catch (error) {
    console.error("Error refreshing students:", error);
  }
}

// Helper function to add a student to the table
async function addStudentToTable(student) {
  const newRow = `
  <tr data-id="${student.nim}">
    <td>${student.nim}</td>
    <td>${student.name}</td>
    <td>${student.faculty}</td>
    <td>
      <div class="action-buttons">
        <button class="btn btn-small btn-edit">Edit</button>
        <button class="btn btn-small btn-delete" onclick="deleteStudent('${student.nim}')">Hapus</button>
      </div>
    </td>
  </tr>
`;
  $("#students-table tbody").append(newRow);
}