<script>
  let tasks = [
    {
      id: 1,
      command: "CCE 일반점검",
      date: "",
      executor: "",
      schedule: "",
      interval: "",
      times: "",
      result: "",
      rating: "",
      extra: "",
    },
    {
      id: 2,
      command: "CCE 긴급점검",
      date: "",
      executor: "",
      schedule: "",
      interval: "",
      times: "",
      result: "",
      rating: "",
      extra: "",
    },
    {
      id: 3,
      command: "에이전트 점 보수집",
      date: "",
      executor: "",
      schedule: "",
      interval: "",
      times: "",
      result: "",
      rating: "",
      extra: "",
    },
    // Add more tasks here
  ];

  let selectedTaskId = null;

  function selectTask(taskId) {
    selectedTaskId = taskId;
  }
</script>

<main>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>순번</th>
          <th>명령대상</th>
          <th>일시</th>
          <th>수행자</th>
          <th>스케줄링</th>
          <th>반복주기</th>
          <th>수행횟수</th>
          <th>수행결과</th>
          <th>등급</th>
          <th>...</th>
          <th>...</th>
        </tr>
      </thead>
      <tbody>
        {#each tasks as task (task.id)}
          <tr
            class:selected={task.id === selectedTaskId}
            on:click={() => selectTask(task.id)}
          >
            <td>{task.id}</td>
            <td>{task.command}</td>
            <td>{task.date}</td>
            <td>{task.executor}</td>
            <td>{task.schedule}</td>
            <td>{task.interval}</td>
            <td>{task.times}</td>
            <td>{task.result}</td>
            <td>{task.rating}</td>
            <td>{task.extra}</td>
            <td>{task.extra}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</main>

<style>
  .table-container {
    margin: 50px auto;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 10px;
    max-width: 1200px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    max-height: 500px;
    overflow-x: hidden;
    overflow-y: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }

  th,
  td {
    padding: 12px;
    text-align: center;
    border-bottom: 1px solid #ddd;
    font-size: 14px;
    border: 1px solid #ccc;
  }

  th {
    background-color: #005fa3;
    color: white;
  }

  tr:hover {
    background-color: #e2e2e2;
  }

  .selected {
    background-color: #ffeb3b;
    font-weight: bold;
  }
</style>
