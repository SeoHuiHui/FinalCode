import mysql.connector
import tkinter as tk
from tkinter import messagebox
import pw

class MainPage(tk.Frame):
    def __init__(self, parent):
        super().__init__(parent, bg='#1C3B0D')
        self.parent = parent
        self.button1 = tk.Button(self, text="기증자", font=("Arial", 12, "bold"), background='#E3D697',width=15,height=5,command=self.go_to_sellerpage)
        self.button2 = tk.Button(self, text="구매자", font=("Arial", 12, "bold"), background='#E3D697',width=15,height=5,command=self.go_to_buyerpage)
        self.button1.pack(pady=60)
        self.button2.pack(pady=60)

    def go_to_sellerpage(self):
        self.pack_forget()
        sellerpage = SellerPage(self.parent)
        sellerpage.pack()

    def go_to_buyerpage(self):
        self.pack_forget()
        buyerpage = BuyerPage(self.parent)
        buyerpage.pack()

class BasePage(tk.Frame):
    def __init__(self, parent, title, secret_query):
        super().__init__(parent, bg='#1C3B0D')
        self.parent = parent
        self.secret = []
        self.id_product = []
        self.button = tk.Button(self, text="Home 화면", bg='#E3D697', command=self.go_to_mainPage)
        self.button.pack(pady=10)
        # Connect to MySQL
        self.conn = mysql.connector.connect(
            host='mysql-db.cx7oaruqj7jl.ap-northeast-2.rds.amazonaws.com',
            user='admin',
            password='coydewha',
            database='mysqlDB'
        )
        
        self.cursor = self.conn.cursor()
        # Calculate font size based on parent height
        font_size = int(self.parent.winfo_height() / 30)
        
        # Create the widgets
        self.label = tk.Label(self, text=title, bg='#ECF2FF', font=("Helvetica", font_size, "bold"))
        self.listbox = tk.Listbox(self, height=20, width=20, bg='#E3D697', font=("Helvetica", font_size))
        self.listbox.bind('<<ListboxSelect>>', self.on_select)
        self.password_entry = tk.Entry(self, show='*', font=("Helvetica", font_size))
        self.login_button = tk.Button(self, text='확인', bg='#E3D697', font=("Helvetica", font_size), command=self.login)
        self.product_frame = tk.Frame(self)
        self.product_id_label = tk.Label(self.product_frame)
        self.product_title_label = tk.Label(self.product_frame)

        # Pack the widgets
        self.label.pack(pady=10)
        self.listbox.pack(side=tk.LEFT, padx = 10, pady = 10, fill=tk.BOTH, expand=True)        
        self.password_entry.pack(padx=6)
        self.login_button.pack(pady = 12)
        self.product_frame.pack()

        # Load the products from the database
        self.load_products(secret_query)

        # Disable the resizing of the frame to adjust the size of the listbox
        self.pack_propagate(False)
        # Make the frame fill its parent widget
        self.pack(fill=tk.BOTH, expand=True)

    def load_products(self, secret_query):
        self.cursor.execute(secret_query)
        rows = self.cursor.fetchall()
        for row in rows:
            self.listbox.insert(tk.END, f"{row[0]} - {row[1]}")
            self.secret.append(row[2])
            self.id_product.append(row[0])

    def on_select(self, event):
        widget = event.widget
        selection = widget.curselection()
        if selection:
            index = selection[0]
            product = widget.get(index)
            id, title = product.split(' - ')
            self.product_id_label.config(text=id)
            self.product_title_label.config(text=title)
            self.pack()

    def go_to_mainPage(self):
        self.pack_forget()
        mainpage = MainPage(self.parent)
        mainpage.pack()

    def login(self):
        selection = self.listbox.curselection()
        if selection:
            selected_product_id = selection[0]
            password = self.password_entry.get()
            if password == self.secret[selected_product_id]:
                messagebox.showinfo('Success', '확인되었습니다!')
                self.go_to_mainPage()
            else:
                messagebox.showerror('Error', '옳지 않은 비밀번호입니다.')
        else:
            messagebox.showerror('Error', '물품을 선택해주세요.')

class SellerPage(BasePage):
    def __init__(self, parent):
        title = "기증할 물품을 선택해주세요."
        secret_query = "SELECT id, title, password FROM productdata where length(password)=4"
        super().__init__(parent, title, secret_query)
    def login(self):
        selection = self.listbox.curselection()
        if selection:
            selected_product_id = selection[0]
            password = self.password_entry.get()
            if password == self.secret[selected_product_id]:
                messagebox.showinfo('Success', '확인되었습니다!')
                new_pw = pw.makePw(self)
                sql = "UPDATE productdata SET password = %s WHERE (id = %s);"
                self.cursor.execute(sql, (new_pw, self.id_product[selected_product_id]))
                self.conn.commit()
                self.go_to_mainPage()
            else:
                messagebox.showerror('Error', '옳지 않은 비밀번호입니다.')
        else:
            messagebox.showerror('Error', '물품을 선택해주세요.')

class BuyerPage(BasePage):
    def __init__(self, parent):
        title = "찾으실 물품을 선택해주세요."
        secret_query = "SELECT id, title, password FROM productdata where length(password)=5"
        super().__init__(parent, title, secret_query)
    def login(self):
        selection = self.listbox.curselection()
        if selection:
            selected_product_id = selection[0]
            password = self.password_entry.get()
            if password == self.secret[selected_product_id]:
                messagebox.showinfo('Success', '확인되었습니다!')
                sql = "UPDATE productdata SET password = %s WHERE (id = %s);"
                self.cursor.execute(sql, (0, self.id_product[selected_product_id]))
                self.conn.commit()
                self.go_to_mainPage()
            else:
                messagebox.showerror('Error', '옳지 않은 비밀번호입니다.')
        else:
            messagebox.showerror('Error', '물품을 선택해주세요.')


if __name__ == "__main__":
    root = tk.Tk()
    root.title = ("COYD")
    root.geometry('800x450')
    root.resizable(True, True)
    root.configure(bg='#1C3B0D')
    mainpage = MainPage(root)
    mainpage.pack(side="top", fill="both", expand=True)
    root.mainloop()