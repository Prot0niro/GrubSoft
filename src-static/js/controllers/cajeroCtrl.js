app.controller('cajeroCtrl', function ($scope) {
	$scope.categorias = [
		{ nombre: 'Categoria01' },
		{ nombre: 'Categoria02' },
		{ nombre: 'Categoria03' },
		{ nombre: 'Categoria04' },
		{ nombre: 'Categoria05' },
	];
	$scope.items = [
		{
			nombre: 'Item01',
			categoria: 'Categoria01',
			precio: 10,
			descripcion: 'Test',
			imagen: 'necro.jpeg'
		},
		{
			nombre: 'Item02',
			categoria: 'Categoria01',
			precio: 10,
			descripcion: 'Test',
			imagen: 'necro.jpeg'
		},
		{
			nombre: 'Item03',
			categoria: 'Categoria02',
			precio: 10,
			descripcion: 'Test',
			imagen: 'necro.jpeg'
		},
		{
			nombre: 'Item04',
			categoria: 'Categoria02',
			precio: 10,
			descripcion: 'Test',
			imagen: 'necro.jpeg'
		},
		{
			nombre: 'Item05',
			categoria: 'Categoria02',
			precio: 10,
			descripcion: 'Test',
			imagen: 'necro.jpeg'
		},
		{
			nombre: 'Item06',
			categoria: 'Categoria03',
			precio: 10,
			descripcion: 'Test',
			imagen: 'necro.jpeg'
		},
		{
			nombre: 'Item07',
			categoria: 'Categoria03',
			precio: 10,
			descripcion: 'Test',
			imagen: 'necro.jpeg'
		}
	];
	$scope.carrito = [
		{
			nombre: 'Item',
			categoria: 'Categoria01',
			precio: 10,
			descripcion: 'Test',
			imagen: 'necro.jpeg'
		},
		{
			nombre: 'Item',
			categoria: 'Categoria01',
			precio: 10,
			descripcion: 'Test',
			imagen: 'necro.jpeg'
		},
		{
			nombre: 'Item',
			categoria: 'Categoria02',
			precio: 10,
			descripcion: 'Test',
			imagen: 'necro.jpeg'
		},
	];
	$scope.catSelected = '';
	
});
