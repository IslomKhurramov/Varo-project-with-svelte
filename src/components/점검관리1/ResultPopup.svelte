<script>
	export let modalData;

	const tableHead = [
        '넘버',
        '호스트명',
        '아이피주소',
        '점검대상',
        '보안점수',
        
    ]

	$: {
		console.log("modalData:", modalData)
	}
</script>

<table class="">
	<thead>
		<tr>
			{#each tableHead as columnHeading}
				<th>{columnHeading}</th>
			{/each}
		<tr/>
	</thead>
	<tbody>
		{#each modalData as data, index}
			<tr>
				<td>{index + 1}</td>
				<td>{data?.ast_uuid__ass_uuid__ast_hostname}</td>
				<td>{data?.ast_uuid__ass_uuid__ast_ipaddr}</td>
				<td>{data?.ast_uuid__ast_target__cct_target}</td>
				<td>{data?.ast_security_point > 0 ? `${data?.ast_security_point}%` : '결과미등록'}</td>
			</tr>
		{/each}
        
	</tbody>
</table>

<style>
	table {
		width: 100%;
	}
	table, th, td {
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

	th, td {
		padding: 5px 3px;
	}
	
</style>
