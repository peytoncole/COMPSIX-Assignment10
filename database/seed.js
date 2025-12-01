const { User, Task } = require('./setup');

(async () => {
  await User.destroy({ where: {} });
  await Task.destroy({ where: {} });

  const users = await User.bulkCreate([
    { name: "John Employee", email: "john@company.com", password: "password123", role: "employee" },
    { name: "Sarah Manager", email: "sarah@company.com", password: "password123", role: "manager" },
    { name: "Mike Admin", email: "mike@company.com", password: "password123", role: "admin" }
  ]);

  await Task.bulkCreate([
    { title: "Task A", description: "Employee task", UserId: users[0].id },
    { title: "Task B", description: "Manager task", UserId: users[1].id }
  ]);

  console.log("Seed complete.");
  process.exit();
})();
