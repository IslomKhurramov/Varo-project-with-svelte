<script>
  let users = [
    {
      id: 1,
      email: "user1@example.com",
      name: "User One",
      role: "관리자권한",
      department: "Sales",
      contact: "010-1234-5678",
    },
    {
      id: 2,
      email: "user2@example.com",
      name: "User Two",
      role: "운영자권한",
      department: "Marketing",
      contact: "010-8765-4321",
    },
  ];

  let selectedUser = null;
  let userInfo = {
    name: "",
    email: "",
    department: "",
    role: "",
    password: "",
    question: "",
  };
  let activeTab = "info"; // Track the active tab

  function selectUser(user) {
    selectedUser = user;
    userInfo = { ...user };
    activeTab = "info"; // Default to the 'info' tab when selecting a user
  }

  function addUser() {
    const newUser = {
      id: users.length + 1,
      email: "",
      name: "",
      role: "",
      department: "",
      contact: "",
      password: "",
      question: "",
    };
    users = [...users, newUser];
    selectUser(newUser);
  }

  function deleteUser(id) {
    users = users.filter((user) => user.id !== id);
    if (selectedUser && selectedUser.id === id) {
      selectedUser = null;
      userInfo = {
        name: "",
        email: "",
        department: "",
        role: "",
        password: "",
        question: "",
      };
    }
  }

  function saveChanges() {
    users = users.map((user) =>
      user.id === selectedUser.id ? { ...userInfo } : user,
    );
    selectedUser = null;
  }

  function resetForm() {
    if (selectedUser) {
      userInfo = { ...selectedUser };
    }
  }

  function showTab(tabId) {
    activeTab = tabId; // Set the active tab
  }
</script>

<main>
  <div class="container">
    <!-- User List -->
    <h3>사용자 목록 (User List)</h3>
    <table>
      <thead>
        <tr>
          <th>순번</th>
          <th>이메일</th>
          <th>이름</th>
          <th>유저권한</th>
          <th>부서</th>
          <th>연락처</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each users as user (user.id)}
          <tr
            on:click={() => selectUser(user)}
            class:selected={user === selectedUser}
          >
            <td>{user.id}</td>
            <td>{user.email}</td>
            <td>{user.name}</td>
            <td>{user.role}</td>
            <td>{user.department}</td>
            <td>{user.contact}</td>
            <td>
              <button on:click|stopPropagation={() => deleteUser(user.id)}
                >삭제/변경</button
              >
            </td>
          </tr>
        {/each}
      </tbody>
    </table>

    <div class="actions">
      <button on:click={addUser}>계정추가</button>
    </div>

    {#if selectedUser}
      <!-- User Information Modification -->
      <div class="tab-container">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
          class="tab {activeTab === 'info' ? 'active' : ''}"
          on:click={() => showTab("info")}
        >
          정보변경
        </div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
          class="tab {activeTab === 'password' ? 'active' : ''}"
          on:click={() => showTab("password")}
        >
          비밀번호변경
        </div>
      </div>

      <div class="tab-content {activeTab === 'info' ? 'active' : ''}" id="info">
        <h3>사용자 정보 변경 (User Information Modification)</h3>
        <form on:submit|preventDefault={saveChanges}>
          <div class="form-group">
            <label for="username">사용자이름</label>
            <input id="username" type="text" bind:value={userInfo.name} />
          </div>
          <div class="form-group">
            <label for="email">이메일</label>
            <input id="email" type="email" bind:value={userInfo.email} />
          </div>
          <div class="form-group">
            <label for="department">부서</label>
            <select id="department" bind:value={userInfo.department}>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="Support">Support</option>
            </select>
          </div>
          <div class="form-group">
            <label for="role">유저권한</label>
            <select id="role" bind:value={userInfo.role}>
              <option value="관리자권한">관리자권한</option>
              <option value="운영자권한">운영자권한</option>
              <option value="뷰어">뷰어</option>
            </select>
          </div>
          <div class="form-group">
            <label for="question">임시질문</label>
            <select id="question" bind:value={userInfo.question}>
              <option value="animal">Favourite animal</option>
              <option value="food">Favourite food</option>
              <option value="pet">Name of your pet</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="submit">Submit</button>
            <button type="reset" on:click={resetForm}>Reset</button>
          </div>
        </form>
      </div>

      <div
        class="tab-content {activeTab === 'password' ? 'active' : ''}"
        id="password"
      >
        <h3>비밀번호 변경 (Password Change)</h3>
        <form on:submit|preventDefault={saveChanges}>
          <div class="form-group">
            <label for="current-password">현재비밀번호</label>
            <input id="current-password" type="password" />
          </div>
          <div class="form-group">
            <label for="new-password">변경비밀번호</label>
            <input id="new-password" type="password" />
          </div>
          <div class="form-group">
            <label for="confirm-password">비밀번호 확인</label>
            <input id="confirm-password" type="password" />
          </div>
          <div class="form-actions">
            <button type="submit">Submit</button>
            <button type="reset" on:click={resetForm}>Reset</button>
          </div>
        </form>
      </div>
    {/if}
  </div>
</main>

<style>
  main {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .container {
    padding: 20px;
    width: 80%;
    border-radius: 10px;
    border: 1px solid #ccc;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #f4f4f4;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  tr:hover {
    background-color: #f1f1f1;
  }

  tr.selected {
    background-color: rgb(163, 227, 254);
  }

  .actions {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
  .actions button {
    background-color: #28a745;
  }

  button {
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056b3;
  }

  form {
    max-width: 500px;
    margin: auto;
    padding: 20px;
    border-radius: 8px;
    background-color: #f4f4f4;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .form-group {
    margin-bottom: 15px;
  }

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }

  input,
  select {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 4px;
    border: 1px solid #ccc;
  }

  .form-actions {
    display: flex;
    justify-content: space-between;
  }

  .tab-container {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }

  .tab {
    padding: 10px 20px;
    cursor: pointer;
    background-color: #f1f1f1;
    border: 1px solid #ccc;
    border-bottom: none;
  }

  .tab.active {
    background-color: white;
    border-top: 2px solid #007bff;
    font-weight: bold;
  }

  .tab-content {
    display: none;
  }

  .tab-content.active {
    display: block;
  }
</style>
