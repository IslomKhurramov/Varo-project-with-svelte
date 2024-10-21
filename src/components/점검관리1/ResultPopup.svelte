<script>
  export let modalData;

  let sortPoint = "ASC";
  let sortHost = "ASC";
  let sorted = false;

  function sortData(field, sort, setSort) {
    if (sort === "ASC") {
      modalData = modalData.sort((a, b) => {
        if (typeof a[field] === "string") {
          return a[field].localeCompare(b[field]);
        }
        return a[field] - b[field];
      });
      setSort("DESC");
    } else {
      modalData = modalData.sort((a, b) => {
        if (typeof a[field] === "string") {
          return b[field].localeCompare(a[field]);
        }
        return b[field] - a[field];
      });
      setSort("ASC");
    }
  }

  $: {
    if (!sorted) {
      modalData = modalData.sort((a, b) => {
        return a.ast_security_point - b.ast_security_point;
      });
      modalData = modalData.sort((a, b) => {
        return b.ast_uuid__ass_uuid__ast_hostname.localeCompare(
          a.ast_uuid__ass_uuid__ast_hostname,
        );
      });
      sorted = true;
    }
  }
</script>

<table class="">
  <thead>
    <tr>
      <th>넘버</th>
      <th
        on:click={() =>
          sortData(
            "ast_uuid__ass_uuid__ast_hostname",
            sortHost,
            (newSort) => (sortHost = newSort),
          )}
      >
        <p class="sort-img">
          호스트명
          <img
            src="./assets/images/icon/sort.svg"
            class={sortHost !== "ASC" ? "rotate" : ""}
          />
        </p>
      </th>
      <th>아이피주소</th>
      <th>점검대상</th>
      <th
        on:click={() =>
          sortData(
            "ast_security_point",
            sortPoint,
            (newSort) => (sortPoint = newSort),
          )}
      >
        <p class="sort-img">
          보안점수
          <img
            src="./assets/images/icon/sort.svg"
            class={sortPoint !== "ASC" ? "rotate" : ""}
          />
        </p>
      </th>
    </tr><tr />
  </thead>
  <tbody>
    {#each modalData as data, index}
      <tr>
        <td>{index + 1}</td>
        <td>{data?.ast_uuid__ass_uuid__ast_hostname}</td>
        <td>{data?.ast_uuid__ass_uuid__ast_ipaddr}</td>
        <td>{data?.ast_uuid__ast_target__cct_target}</td>
        <td>
          {data?.ast_security_point > 0
            ? `${data?.ast_security_point}%`
            : "결과미등록"}
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  table {
    width: 100%;
  }
  table,
  th,
  td {
    border: 1px solid;
    border-collapse: collapse;
    margin-bottom: 10px;
    color: #6e6f6f;
  }

  thead tr {
    background-color: #f3f7d9;
  }

  td {
    text-align: center;
  }

  th,
  td {
    padding: 5px 3px;
  }

  .sort-img {
    cursor: pointer;
    display: flex;
    text-align: center;
    justify-content: center;
  }

  .sort-img img {
    width: 20px;
    height: 20px;
    margin-left: 5px;
  }

  .rotate {
    transform: rotate(180deg);
  }
</style>
